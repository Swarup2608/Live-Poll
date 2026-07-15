"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

type AuthTab = "login" | "signup";

const inputClass =
  "w-full rounded-[10px] border border-[var(--lb-border)] bg-[var(--lb-surface)] px-[14px] py-[13px] text-[15px] text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]";

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const isLogin = tab === "login";

  useEffect(() => {
    if (!heroRef.current) {
      return;
    }

    heroRef.current.style.setProperty("--mx", "50%");
    heroRef.current.style.setProperty("--my", "50%");
  }, []);

  function handleHeroMouseMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    setIsHoveringHero(true);
  }

  function handleHeroMouseLeave() {
    setIsHoveringHero(false);
  }

  return (
    <main className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)]">
      <section className="auth-left flex w-full flex-1 flex-col px-6 py-10 sm:px-10 lg:max-w-[520px] lg:px-14 lg:py-12 overflow-y-auto">
        <div className="mb-12 flex items-center gap-2.5 lg:mb-16">
          <div className="h-8 w-8 rounded-[9px] bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-grad2))] shadow-[0_4px_14px_var(--lb-accent-soft)]" />
          <div className="font-[var(--font-display)] text-[19px] font-bold text-[var(--lb-text)]">
            loopballot
          </div>
        </div>

        <div className="mx-auto w-full max-w-[380px]">
          <h1 className="mb-2 font-[var(--font-display)] text-[30px] font-bold text-[var(--lb-text)]">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-8 text-[15px] text-[var(--lb-text-muted)]">
            {isLogin
              ? "Log in to host or manage your rooms."
              : "Start hosting live polls and Q&A in minutes."}
          </p>

          <div className="mb-7 flex rounded-xl bg-[var(--lb-accent-soft)] p-1">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 rounded-[9px] px-3 py-2.5 text-sm font-semibold transition ${
                isLogin
                  ? "bg-[var(--lb-surface)] text-[var(--lb-text)] shadow-[var(--lb-shadow)]"
                  : "text-[var(--lb-text-muted)]"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={`flex-1 rounded-[9px] px-3 py-2.5 text-sm font-semibold transition ${
                !isLogin
                  ? "bg-[var(--lb-surface)] text-[var(--lb-text)] shadow-[var(--lb-shadow)]"
                  : "text-[var(--lb-text-muted)]"
              }`}
            >
              Sign up
            </button>
          </div>

          <form className="flex flex-col gap-4 min-h-[280px]">
            {!isLogin && (
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-[var(--lb-text)]">
                  Full name
                </span>
                <input
                  type="text"
                  placeholder="Ada Lovelace"
                  className={inputClass}
                />
              </label>
            )}

            {/* {isLogin && <div className="h-[70px]" />} */}

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-[var(--lb-text)]">
                Email
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                className={inputClass}
              />
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[var(--lb-text)]">
                  Password
                </span>
                {isLogin && (
                  <a
                    href="#"
                    className="text-[13px] font-semibold text-[var(--lb-accent)] hover:opacity-80"
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[var(--lb-text-muted)] hover:text-[var(--lb-text)]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 rounded-[10px] bg-[var(--lb-accent)] px-4 py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_20px_var(--lb-accent-soft)] transition hover:brightness-105"
            >
              {isLogin ? "Log in" : "Create account"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--lb-border)]" />
            <div className="text-xs font-semibold text-[var(--lb-text-muted)]">
              OR
            </div>
            <div className="h-px flex-1 bg-[var(--lb-border)]" />
          </div>

          <a
            href="#"
            className="flex items-center justify-center gap-2.5 rounded-[10px] border border-[var(--lb-border)] px-4 py-[13px] text-[15px] font-semibold text-[var(--lb-text)]"
          >
            <div className="h-[18px] w-[18px] rounded bg-[conic-gradient(oklch(0.6_0.19_260),oklch(0.6_0.19_30),oklch(0.6_0.19_140),oklch(0.6_0.19_260))]" />
            Continue with Google
          </a>

          <p className="mt-9 text-center text-[13px] text-[var(--lb-text-muted)]">
            By continuing you agree to loopballot&apos;s <a href="#">Terms</a>{" "}
            &amp; <a href="#">Privacy Policy</a>.
          </p>
        </div>

        <div className="flex-1" />
      </section>

      <aside
        ref={heroRef}
        onPointerMove={handleHeroMouseMove}
        onPointerLeave={handleHeroMouseLeave}
        className="auth-right relative hidden h-screen cursor-none overflow-hidden lg:block lg:flex-1"
      >
        {/* Base photo — dark concert crowd */}
        <div className="absolute inset-0">
          <Image
            src="/auth-hero-dark.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Dimming scrim over the base photo */}
        <div className="absolute inset-0 bg-[oklch(0.1_0.02_275_/_0.55)] pointer-events-none" />

        {/* Colorful photo revealed only inside the cursor circle */}
        <div className="absolute inset-0 [-webkit-mask-image:radial-gradient(circle_220px_at_var(--mx)_var(--my),black_60%,transparent_100%)] [mask-image:radial-gradient(circle_220px_at_var(--mx)_var(--my),black_60%,transparent_100%)]">
          <Image
            src="/auth-hero-color.png"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <div
          className={`pointer-events-none absolute h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(1_0_0_/_0.6)] [left:var(--mx)] [top:var(--my)] transition-opacity duration-200 ${
            isHoveringHero ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="lb-anim-float-a pointer-events-none absolute left-[10%] top-[14%] z-[2] h-[90px] w-[90px] rounded-full bg-[oklch(0.6_0.2_320_/_0.35)] backdrop-blur-[2px]" />
        <div className="lb-anim-float-b pointer-events-none absolute right-[12%] top-[55%] z-[2] h-[56px] w-[56px] rounded-full bg-[oklch(0.65_0.19_275_/_0.4)] backdrop-blur-[2px]" />
        <div className="lb-anim-float-a pointer-events-none absolute bottom-[22%] left-[16%] z-[2] h-[34px] w-[34px] rounded-full border-2 border-[oklch(1_0_0_/_0.5)]" />
        <div className="lb-anim-float-b pointer-events-none absolute right-[24%] top-[32%] z-[2] h-4 w-4 rounded-full bg-[oklch(0.7_0.19_145_/_0.6)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] p-12 text-white">
          <h2 className="mb-2 font-[var(--font-display)] text-[26px] font-bold">
            Every voice, one live room.
          </h2>
          <p className="text-sm text-[oklch(0.85_0.02_275)]">
            Trusted by 40,000+ events worldwide.
          </p>
        </div>
      </aside>
    </main>
  );
}
