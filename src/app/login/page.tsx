"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Home, User, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showLoggedOut = searchParams.get("loggedOut") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push("/inventory");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative flex-1 flex flex-col items-center justify-center px-6 py-16"
        style={{
          background:
            "linear-gradient(144deg, rgb(0, 79, 59) 0%, rgb(1, 102, 48) 50%, rgb(11, 79, 74) 100%)",
        }}
      >
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

          {showLoggedOut && (
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
          )}

          <div className="w-full bg-white rounded-2xl border-4 border-[rgba(0,122,85,0.3)] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-6 text-center">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-base text-[#d0fae5] mt-1">
                Log in to access your inventory
              </p>
            </div>

            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#314158]"
                  >
                    Email
                  </label>
                  <div className="flex items-center gap-3 border-2 border-[#e2e8f0] rounded-xl px-4 py-3 focus-within:border-[#007a55] transition-colors">
                    <User className="size-5 text-[#90a1b9] shrink-0" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none bg-transparent"
                    />
                  </div>
                </div>

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
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <LogIn className="size-5" />
                  )}
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="text-sm font-semibold text-[#009966] hover:text-[#007a55] transition-colors"
                >
                  Don&apos;t have an account? Sign up
                </Link>
              </div>
            </div>
          </div>

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
