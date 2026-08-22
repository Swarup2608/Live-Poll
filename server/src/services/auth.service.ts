import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signAccessToken } from "../lib/jwt.js";
import { generateOpaqueToken, hashToken } from "../lib/tokens.js";
import { env } from "../env.js";
import type { GoogleProfile } from "../lib/googleOAuth.js";
import type { SignupInput, LoginInput } from "../schemas/auth.schemas.js";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function sanitizeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    website: user.website,
    notify: user.notify,
    preferredTheme: user.preferredTheme,
    createdAt: user.createdAt
  };
}

async function organizationsForUser(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId, status: "active" },
    include: { organization: true }
  });

  return memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    role: membership.role,
    currentPlanId: membership.organization.currentPlanId
  }));
}

interface Session {
  accessToken: string;
  rawRefreshToken: string;
  refreshTokenId: string;
}

async function issueSession(user: Pick<User, "id" | "email">): Promise<Session> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const rawRefreshToken = generateOpaqueToken();

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    }
  });

  return { accessToken, rawRefreshToken, refreshTokenId: refreshToken.id };
}

async function createUserWithOrg(params: {
  name: string;
  email: string;
  orgName: string;
  passwordHash: string | null;
  googleId?: string;
  avatarUrl?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: params.name,
        email: params.email,
        passwordHash: params.passwordHash,
        googleId: params.googleId,
        avatarUrl: params.avatarUrl ?? null
      }
    });

    const organization = await tx.organization.create({
      data: { name: params.orgName }
    });

    await tx.organizationMember.create({
      data: {
        orgId: organization.id,
        userId: user.id,
        role: "Owner",
        status: "active"
      }
    });

    return { user, organization };
  });
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new HttpError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(input.password);
  const { user, organization } = await createUserWithOrg({
    name: input.name,
    email: input.email,
    orgName: input.orgName,
    passwordHash
  });

  const session = await issueSession(user);

  return {
    user: sanitizeUser(user),
    organizations: [
      { id: organization.id, name: organization.name, role: "Owner", currentPlanId: organization.currentPlanId }
    ],
    ...session
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const [organizations, session] = await Promise.all([organizationsForUser(user.id), issueSession(user)]);

  return { user: sanitizeUser(user), organizations, ...session };
}

export async function refresh(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) {
    throw new HttpError(401, "Missing refresh token");
  }

  const tokenHash = hashToken(rawRefreshToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const session = await issueSession(user);

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), replacedBy: session.refreshTokenId }
  });

  return session;
}

export async function logout(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) {
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  const organizations = await organizationsForUser(user.id);
  return { user: sanitizeUser(user), organizations };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  const rawToken = generateOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS)
    }
  });

  if (env.NODE_ENV !== "production") {
    // TODO: wire to a real email provider (SES/Postmark/etc.) once one is configured.
    console.log(`[dev] password reset: ${env.CLIENT_ORIGIN}/reset-password?token=${rawToken}`);
  }
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } }
  });

  if (!record) {
    throw new HttpError(400, "Invalid or expired token");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);
}

export async function loginOrCreateWithGoogle(profile: GoogleProfile) {
  let user = await prisma.user.findUnique({ where: { googleId: profile.googleId } });

  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email: profile.email } });

    if (existingByEmail) {
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { googleId: profile.googleId }
      });
    } else {
      const created = await createUserWithOrg({
        name: profile.name,
        email: profile.email,
        orgName: `${profile.name}'s workspace`,
        passwordHash: null,
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl
      });
      user = created.user;
    }
  }

  const [organizations, session] = await Promise.all([organizationsForUser(user.id), issueSession(user)]);

  return { user: sanitizeUser(user), organizations, ...session };
}
