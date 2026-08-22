"use client";

import { Suspense, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, CircleCheck, CreditCard, Download, Key, Mail, UserPlus } from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";
import Modal from "@/components/Modal";
import Toggle from "@/components/Toggle";

type Tab = "profile" | "billing" | "team";
type Role = "Admin" | "Editor" | "Viewer";
type Member = { name: string; email: string; role: string };

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "billing", label: "Billing" },
  { key: "team", label: "Team members" },
];

const INITIAL_TEAM: Member[] = [
  { name: "Jordan Ade", email: "jordan@company.com", role: "Owner" },
  { name: "Priya Nandan", email: "priya@company.com", role: "Admin" },
  { name: "Sam Torres", email: "sam@company.com", role: "Editor" },
];

const INVOICES = [
  { month: "Jun 2026", amount: "$79.00" },
  { month: "May 2026", amount: "$79.00" },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29/mo",
    desc: "Up to 200 attendees per room · 5 events / month",
  },
  {
    id: "team",
    name: "Team",
    price: "$79/mo",
    desc: "Up to 2,000 attendees per room · unlimited events",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    desc: "Unlimited attendees · SSO · dedicated support",
  },
];

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function detectCardBrand(digits: string) {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

function buildInvoiceText(inv: { month: string; amount: string }) {
  return [
    "Loopballot — Invoice",
    `Billing period: ${inv.month}`,
    `Plan: Team`,
    `Amount: ${inv.amount}`,
    "Status: Paid",
    "",
    "Thank you for using Loopballot.",
  ].join("\n");
}

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={null}>
      <AccountSettingsContent />
    </Suspense>
  );
}

function AccountSettingsContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab: Tab =
    requestedTab === "billing" || requestedTab === "team"
      ? requestedTab
      : "profile";

  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("Jordan Ade");
  const [email, setEmail] = useState("jordan@company.com");
  const [website, setWebsite] = useState("");
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [notify, setNotify] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [currentPlanId, setCurrentPlanId] = useState("team");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId);

  const [team, setTeam] = useState<Member[]>(INITIAL_TEAM);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Editor");
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [cardBrand, setCardBrand] = useState("Visa");
  const [cardLast4, setCardLast4] = useState("4242");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const websiteError = !websiteTouched
    ? null
    : website.trim() === ""
      ? "Website is required"
      : !isValidUrl(website)
        ? "Enter a valid URL"
        : null;

  const activeHref =
    tab === "profile" ? "/account-settings" : `/account-settings?tab=${tab}`;
  const currentPlan = PLANS.find((p) => p.id === currentPlanId)!;

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function handleSubmitPassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  }

  function handleSendInvite() {
    const trimmed = inviteEmail.trim();
    if (!isValidEmail(trimmed)) {
      setInviteError("Enter a valid email address.");
      return;
    }
    if (team.some((m) => m.email.toLowerCase() === trimmed.toLowerCase())) {
      setInviteError("This person is already on the team.");
      return;
    }
    setTeam((prev) => [
      ...prev,
      { name: trimmed.split("@")[0], email: trimmed, role: inviteRole },
    ]);
    setInviteModalOpen(false);
    setInviteEmail("");
    setInviteRole("Editor");
    setInviteError(null);
  }

  function handleDownloadInvoice(inv: { month: string; amount: string }) {
    const blob = new Blob([buildInvoiceText(inv)], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loopballot-invoice-${inv.month.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleSubmitPayment() {
    const digits = cardNumber.replace(/\s+/g, "");
    if (!cardName.trim()) {
      setPaymentError("Cardholder name is required.");
      return;
    }
    if (!/^\d{13,19}$/.test(digits)) {
      setPaymentError("Enter a valid card number.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
      setPaymentError("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cardCvc.trim())) {
      setPaymentError("Enter a valid CVC.");
      return;
    }
    setCardBrand(detectCardBrand(digits));
    setCardLast4(digits.slice(-4));
    setPaymentModalOpen(false);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaymentError(null);
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref={activeHref}
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />
          <div className="font-[var(--font-display)] text-xl font-bold sm:text-2xl">
            Account settings
          </div>
        </header>

        <main className="max-w-[720px] flex-1 px-4 py-7 sm:px-6 sm:py-9 md:px-10">
          <div className="mb-7 flex gap-6 overflow-x-auto border-b border-[var(--lb-border)]">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-semibold ${
                    active
                      ? "border-[var(--lb-accent)] text-[var(--lb-accent)]"
                      : "border-transparent text-[var(--lb-text-muted)]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === "profile" && (
            <div>
              <div className="mb-7 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--lb-accent-soft)] font-[var(--font-display)] text-xl font-bold text-[var(--lb-accent)]"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Profile photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "JA"
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="lb-btn-outline flex items-center gap-1.5 px-3.5 py-2 text-[13px]"
                >
                  <Camera className="h-3.5 w-3.5" /> Change photo
                </button>
              </div>

              <div className="flex flex-col gap-[18px]">
                <label className="block">
                  <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Full name
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-surface)] px-3.5 py-3.5 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
                  />
                </label>

                <label className="block">
                  <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Email
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-surface)] px-3.5 py-3.5 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
                  />
                </label>

                <label className="block">
                  <div className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Website <span className="text-[oklch(0.55_0.18_25)]">*</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    onBlur={() => setWebsiteTouched(true)}
                    placeholder="https://yourcompany.com"
                    aria-invalid={websiteError !== null}
                    className={`w-full rounded-[10px] border-[1.5px] bg-[var(--lb-surface)] px-3.5 py-3.5 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)] ${
                      websiteError
                        ? "border-[oklch(0.55_0.18_25)]"
                        : "border-[var(--lb-border)]"
                    }`}
                  />
                  {websiteError && (
                    <div className="mt-1.5 text-xs font-medium text-[oklch(0.5_0.18_25)]">
                      {websiteError}
                    </div>
                  )}
                </label>

                <div>
                  <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Password
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError(null);
                      setPasswordModalOpen(true);
                    }}
                    className="lb-btn-outline flex items-center gap-1.5 px-4 py-2.5 text-[13px]"
                  >
                    <Key className="h-3.5 w-3.5" /> Change password
                  </button>
                </div>

                <div className="lb-surface flex items-center justify-between rounded-[14px] px-[18px] py-4">
                  <div>
                    <div className="text-sm font-semibold">
                      Email notifications
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                      Get a summary after each event ends.
                    </div>
                  </div>
                  <Toggle
                    checked={notify}
                    onChange={() => setNotify((v) => !v)}
                    label="Email notifications"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setWebsiteTouched(true)}
                  className="lb-btn-primary mt-2 self-start px-6 py-3 text-sm"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div>
              <div className="lb-surface mb-5 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="mb-1 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                      Current plan
                    </div>
                    <div className="font-[var(--font-display)] text-xl font-bold">
                      {currentPlan.name} — {currentPlan.price}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(currentPlanId);
                      setPlanModalOpen(true);
                    }}
                    className="lb-btn-outline px-[18px] py-2.5 text-[13px]"
                  >
                    Change plan
                  </button>
                </div>
                <div className="mt-3 text-[13px] text-[var(--lb-text-muted)]">
                  {currentPlan.desc}
                </div>
              </div>

              <div className="mb-3 text-sm font-bold">Payment method</div>
              <div className="lb-surface mb-6 flex items-center gap-3.5 rounded-[14px] px-[18px] py-4">
                <div className="flex h-[26px] w-10 items-center justify-center rounded-[5px] bg-[var(--lb-accent-soft)]">
                  <CreditCard className="h-3.5 w-3.5 text-[var(--lb-accent)]" />
                </div>
                <div className="text-sm">
                  {cardBrand} ending in {cardLast4}
                </div>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => {
                    setPaymentError(null);
                    setPaymentModalOpen(true);
                  }}
                  className="text-[13px] font-semibold text-[var(--lb-accent)]"
                >
                  Update
                </button>
              </div>

              <div className="mb-3 text-sm font-bold">Invoices</div>
              <div className="flex flex-col gap-2">
                {INVOICES.map((inv) => (
                  <div
                    key={inv.month}
                    className="lb-surface flex items-center rounded-xl px-[18px] py-3.5"
                  >
                    <div className="flex-1 text-sm">{inv.month}</div>
                    <div className="mr-4 text-[13px] text-[var(--lb-text-muted)]">
                      {inv.amount}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(inv)}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--lb-accent)]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "team" && (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setInviteEmail("");
                    setInviteRole("Editor");
                    setInviteError(null);
                    setInviteModalOpen(true);
                  }}
                  className="lb-btn-primary px-[18px] py-2.5 text-[13px]"
                >
                  + Invite member
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {team.map((member) => (
                  <div
                    key={member.email}
                    className="lb-surface flex items-center gap-3.5 rounded-xl px-[18px] py-3.5"
                  >
                    <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--lb-accent-soft)]" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">
                        {member.name}
                      </div>
                      <div className="text-xs text-[var(--lb-text-muted)]">
                        {member.email}
                      </div>
                    </div>
                    <div className="whitespace-nowrap rounded-full bg-[var(--lb-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--lb-text-muted)]">
                      {member.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {passwordModalOpen && (
        <Modal onClose={() => setPasswordModalOpen(false)}>
          <div className="mb-4 font-[var(--font-display)] text-base font-bold">
            Change password
          </div>
          <div className="flex flex-col gap-3.5">
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Current password
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                New password
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Confirm new password
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            {passwordError && (
              <div className="text-xs font-medium text-[oklch(0.5_0.18_25)]">
                {passwordError}
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setPasswordModalOpen(false)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitPassword}
              className="lb-btn-primary px-4 py-2.5 text-sm"
            >
              Update password
            </button>
          </div>
        </Modal>
      )}

      {planModalOpen && (
        <Modal onClose={() => setPlanModalOpen(false)} widthClass="max-w-[440px]">
          <div className="mb-4 font-[var(--font-display)] text-base font-bold">
            Change plan
          </div>
          <div className="flex flex-col gap-2.5">
            {PLANS.map((p) => {
              const selected = selectedPlanId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`flex items-start justify-between gap-3 rounded-xl border-[1.5px] p-4 text-left ${
                    selected
                      ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)]"
                      : "border-[var(--lb-border)]"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{p.name}</div>
                    <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                      {p.desc}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                    <div className="text-sm font-semibold">{p.price}</div>
                    {selected && (
                      <CircleCheck className="h-4 w-4 text-[var(--lb-accent)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setPlanModalOpen(false)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPlanId(selectedPlanId);
                setPlanModalOpen(false);
              }}
              className="lb-btn-primary px-4 py-2.5 text-sm"
            >
              Confirm plan
            </button>
          </div>
        </Modal>
      )}

      {paymentModalOpen && (
        <Modal onClose={() => setPaymentModalOpen(false)}>
          <div className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-base font-bold">
            <CreditCard className="h-4 w-4" /> Update payment method
          </div>
          <div className="flex flex-col gap-3.5">
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Cardholder name
              </div>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Jordan Ade"
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Card number
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  Expiry
                </div>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
                />
              </label>
              <label className="block">
                <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  CVC
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
                />
              </label>
            </div>
            {paymentError && (
              <div className="text-xs font-medium text-[oklch(0.5_0.18_25)]">
                {paymentError}
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitPayment}
              className="lb-btn-primary px-4 py-2.5 text-sm"
            >
              Save card
            </button>
          </div>
        </Modal>
      )}

      {inviteModalOpen && (
        <Modal onClose={() => setInviteModalOpen(false)}>
          <div className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-base font-bold">
            <UserPlus className="h-4 w-4" /> Invite member
          </div>
          <div className="flex flex-col gap-3.5">
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Email
              </div>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none focus:border-[var(--lb-accent)]"
              />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Role
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-3.5 py-3 text-sm outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </label>
            {inviteError && (
              <div className="text-xs font-medium text-[oklch(0.5_0.18_25)]">
                {inviteError}
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendInvite}
              className="lb-btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm"
            >
              <Mail className="h-3.5 w-3.5" /> Send invite
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
