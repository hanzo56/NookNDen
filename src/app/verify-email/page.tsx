"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail, ArrowLeft, Home } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{
        background:
          "linear-gradient(137deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base text-[#45556c] hover:text-[#1d293d] transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#009966] to-[#009689] px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Home className="size-7 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                NookNDen
              </h1>
            </div>
          </div>

          <div className="px-8 py-10 flex flex-col items-center text-center gap-6">
            <div className="size-20 rounded-full bg-[#ecfdf5] flex items-center justify-center">
              <Mail className="size-10 text-[#009966]" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-[#1d293d]">
                Check your email
              </h2>
              <p className="text-base text-[#45556c] leading-relaxed">
                We&apos;ve sent a verification link to
                {email ? (
                  <span className="block font-semibold text-[#1d293d] mt-1">
                    {email}
                  </span>
                ) : (
                  " your email address"
                )}
              </p>
            </div>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-6 py-4 w-full text-sm text-[#45556c] leading-relaxed">
              <p>
                Please click the link in the email to verify your account.
                Once verified, you can log in to start managing your home
                inventory.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full pt-2">
              <Link
                href="/login"
                className="h-14 bg-gradient-to-r from-[#009966] to-[#009689] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200 flex items-center justify-center"
              >
                Go to Login
              </Link>
            </div>

            <p className="text-xs text-[#90a1b9]">
              Didn&apos;t receive the email? Check your spam folder or try
              registering again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
