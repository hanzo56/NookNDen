"use client";

import Link from "next/link";
import { Home, User, Lock, LogIn, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Login Hero ─── */}
      <section
        className="relative flex-1 flex flex-col items-center justify-center px-6 py-16"
        style={{
          background:
            "linear-gradient(144deg, rgb(0, 79, 59) 0%, rgb(1, 102, 48) 50%, rgb(11, 79, 74) 100%)",
        }}
      >
        {/* Decorative dots (subtle) */}
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-0 left-0 w-16 h-16"
            viewBox="0 0 60 60"
            fill="none"
          >
            <circle cx="5" cy="5" r="2" fill="white" />
            <circle cx="25" cy="5" r="2" fill="white" />
            <circle cx="5" cy="25" r="2" fill="white" />
            <circle cx="25" cy="25" r="2" fill="white" />
            <circle cx="5" cy="45" r="2" fill="white" />
            <circle cx="25" cy="45" r="2" fill="white" />
            <circle cx="45" cy="5" r="2" fill="white" />
            <circle cx="45" cy="25" r="2" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center gap-4">
            <div className="size-20 rounded-full bg-white shadow-2xl flex items-center justify-center">
              <Home className="size-10 text-[#009966]" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              myPlace
            </h1>
            <p className="text-base text-[#d0fae5]">
              Your Home&apos;s Digital DNA
            </p>
          </div>

          {/* Logged out notice */}
          <div className="w-full bg-[#d0fae5] border-2 border-[#5ee9b5] rounded-xl px-4 py-4 flex gap-3">
            <AlertCircle className="size-5 text-[#004f3b] shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-[#004f3b]">
                You&apos;ve been logged out
              </p>
              <p className="text-sm text-[#007a55] mt-1">
                Please log in again to continue managing your home inventory.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white rounded-2xl border-4 border-[rgba(0,122,85,0.3)] shadow-2xl overflow-hidden">
            {/* Card header */}
            <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-6 text-center">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-base text-[#d0fae5] mt-1">
                Log in to access your inventory
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex flex-col gap-5"
              >
                {/* Username */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-semibold text-[#314158]"
                  >
                    Username
                  </label>
                  <div className="flex items-center gap-3 border-2 border-[#e2e8f0] rounded-xl px-4 py-3 focus-within:border-[#007a55] transition-colors">
                    <User className="size-5 text-[#90a1b9] shrink-0" />
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className="flex-1 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#314158]"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-3 border-2 border-[#e2e8f0] rounded-xl px-4 py-3 focus-within:border-[#007a55] transition-colors">
                    <Lock className="size-5 text-[#90a1b9] shrink-0" />
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="flex-1 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200 cursor-pointer"
                >
                  <LogIn className="size-5" />
                  Log In
                </button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 bg-[#ecfdf5] border border-[#a4f4cf] rounded-xl px-4 py-4">
                <p className="text-xs font-semibold text-[#004f3b] mb-2">
                  Demo Credentials:
                </p>
                <p className="text-xs text-[#007a55]">
                  <span className="font-semibold">Username:</span> demo
                </p>
                <p className="text-xs text-[#007a55]">
                  <span className="font-semibold">Password:</span> demo123
                </p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/"
            className="text-base font-medium text-white hover:text-[#d0fae5] transition-colors mt-2"
          >
            &larr; Back to Home Page
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
