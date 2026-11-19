"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Loader2 } from "lucide-react";
import { requestLoginCode, verifyLoginCode } from "./actions";
import { useActionState, useState } from "react";
import { ActionState } from "@/app/lib/auth/middleware";
// import config from "../../../config";
import { getSupabaseClient } from "@/utils/supabase/client";
import AUNLogo from "@/app/components/AUNLogo";
import { Button } from "../components/button";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const host =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_HOST; // TODO: remove NEXT_PUBLIC_HOST fallback after migration
  const handleGoogleSignIn = () => {
    const baseUrl = host ?? window.location.origin;
    const callbackUrl = new URL("/auth/callback", baseUrl);
    if (redirect) {
      callbackUrl.searchParams.set("next", redirect);
    }
    setLoading(true);
    const supabase = getSupabaseClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    setLoading(false);
  };

  const [requestCodeState, requestCodeAction, requestPending] = useActionState<
    ActionState,
    FormData
  >(requestLoginCode, { error: "", success: "" });

  const [verifyCodeState, verifyCodeAction, verifyPending] = useActionState<
    ActionState,
    FormData
  >(verifyLoginCode, {
      error: "",
      success: "",
    });

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <AUNLogo backgroundWhite={true} />
        </div>

        {(() => {
          const otpSent = Boolean(requestCodeState?.success);
          const title = otpSent
            ? "Check your email"
            : mode === "signin"
              ? "Welcome back"
              : "Create your account";

          const subtitle = otpSent
            ? "Enter the 6-digit code we sent you."
            : mode === "signin"
              ? "Sign in to continue to your account"
              : "Get started with your new account";

          return (
            <>
              <h1 className="mt-10 text-2xl font-semibold tracking-tight text-center text-brand-secondary-1">
                {title}
              </h1>
              <p className="mt-2 text-sm text-center text-brand-secondary-0">
                {subtitle}
              </p>
            </>
          );
        })()}

        <div className="mt-10">
          {requestCodeState?.success ? (
            <div className="p-6 text-center bg-brand-secondary-2 rounded-lg">
              <h3 className="text-sm font-medium text-brand-secondary-1">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-brand-secondary-0">
                We&apos;ve sent a 6-digit code to your email.
              </p>

              <form action={verifyCodeAction} className="space-y-4">
                <div className="flex items-center justify-between gap-3 px-4 h-12 bg-brand-primary-1 rounded-lg border border-brand-secondary-2 shadow-sm">
                  <div
                    className="min-w-0 text-sm text-brand-secondary-1 truncate"
                    aria-label="Email address"
                  >
                    {email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // simplest: go back to the request-code screen
                      window.location.href =
                        mode === "signin" ? "/auth/sign-in" : "/auth/sign-up";
                    }}
                    className="text-sm font-medium text-brand-accent-1 hover:text-brand-primary-0 whitespace-nowrap"
                  >
                    Change
                  </button>
                </div>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="redirect" value={redirect || ""} />
                <Input
                  name="loginCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  className="px-4 h-12 bg-brand-primary-1 rounded-lg border-brand-secondary-2 shadow-sm transition-colors focus:border-brand-accent-1 focus:ring-brand-accent-1"
                />
                <p className="text-xs text-brand-secondary-0">
                  Tip: Codes sometimes land in Spam/Promotions.
                </p>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium text-brand-primary-1 bg-brand-primary-0 rounded-lg transition-colors hover:bg-brand-primary-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-1 focus:ring-offset-2"
                >
                  {verifyPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify code"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const formData = new FormData();
                      formData.set("email", email);
                      if (redirect) {
                        formData.set("redirect", redirect);
                      }
                      if (priceId) {
                        formData.set("priceId", priceId);
                      }
                      await requestLoginCode(
                        { error: "", success: "" },
                        formData,
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="w-full text-sm font-medium text-brand-accent-1 hover:text-brand-primary-0"
                >
                  Resend code
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <form action={requestCodeAction} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="px-4 h-12 bg-brand-primary-1 rounded-lg border-brand-secondary-2 shadow-sm transition-colors focus:border-brand-accent-1 focus:ring-brand-accent-1"
                />
                <input type="hidden" name="priceId" value={priceId || ""} />
                <input type="hidden" name="redirect" value={redirect || ""} />

                <Button
                  type="submit"
                  className="w-full h-12 font-medium text-brand-primary-1 bg-brand-primary-0 rounded-lg transition-colors hover:bg-brand-primary-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-1 focus:ring-offset-2"
                >
                  {requestPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="flex absolute inset-0 items-center">
                  <div className="w-full border-t border-brand-secondary-2" />
                </div>
                <div className="flex relative justify-center">
                  <span className="px-4 text-sm text-brand-secondary-2 bg-gradient-to-b from-brand-primary-1 to-brand-secondary-2">
                    or
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 font-medium text-brand-secondary-1 bg-brand-primary-1 rounded-lg border border-brand-secondary-2 shadow-sm transition-all hover:bg-brand-secondary-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-1 focus:ring-offset-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex justify-center items-center text-brand-secondary-1">
                    <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            </div>
          )}

          {requestCodeState?.error && (
            <div className="mt-4 text-sm text-brand-accent-1">
              {requestCodeState.error}
            </div>
          )}

          {verifyCodeState?.error && (
            <div className="mt-4 text-sm text-brand-accent-1">
              {verifyCodeState.error}
            </div>
          )}

          <p className="mt-8 text-sm text-center text-brand-secondary-0">
            {mode === "signin"
              ? "New to our platform? "
              : "Already have an account? "}
            <Link
              href={`${mode === "signin" ? "/auth/sign-up" : "/auth/sign-in"}${
                redirect ? `?redirect=${redirect}` : ""
              }${priceId ? `&priceId=${priceId}` : ""}`}
              className="font-medium text-brand-accent-1 hover:text-brand-primary-0"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
