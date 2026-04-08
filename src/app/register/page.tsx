"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, HelpCircle, Loader2 } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailsMatch = email === confirmEmail;
  const showEmailMismatch = confirmEmail.length > 0 && !emailsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailsMatch) {
      setError("Email addresses do not match. Please check and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          birthday: birthMonth && birthDay && birthYear
            ? { month: birthMonth, day: birthDay, year: birthYear }
            : null,
          gender: gender || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "h-[50px] bg-[#f8fafc] border border-[#cad5e2] rounded-[10px] px-4 text-base text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 outline-none focus:border-[#009966] transition-colors";
  const selectClass =
    "h-[50px] bg-[#f8fafc] border border-[#cad5e2] rounded-[10px] px-3 text-base text-[#0a0a0a] outline-none focus:border-[#009966] transition-colors appearance-none cursor-pointer";

  return (
    <div
      className="min-h-screen flex items-start justify-center px-6 py-10 md:py-16"
      style={{
        background:
          "linear-gradient(137deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)",
      }}
    >
      <div className="w-full max-w-[672px]">
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
            <p className="text-sm text-[#ecfdf5]">
              Create an account to track and manage your home&apos;s complete
              DNA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1d293d]">
                Get started on NookNDen
              </h2>
              <p className="mt-3 text-base text-[#45556c] leading-relaxed max-w-lg">
                Create an account to connect with your home&apos;s complete
                inventory, maintenance history, and documentation.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-[#314158]">
                Name
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </fieldset>

            {/* Birthday */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-[#314158] flex items-center gap-1.5">
                Birthday
                <HelpCircle className="size-4 text-[#90a1b9]" />
              </legend>
              <div className="grid grid-cols-3 gap-4 mt-1">
                <select required value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className={selectClass}>
                  <option value="">Month</option>
                  {months.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select required value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className={selectClass}>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select required value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className={selectClass}>
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-sm font-semibold text-[#314158] flex items-center gap-1.5">
                Gender
                <HelpCircle className="size-4 text-[#90a1b9]" />
              </label>
              <select id="gender" required value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#314158]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-[#62748e]">
                You may receive notifications from us.
              </p>
            </div>

            {/* Confirm Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-email" className="text-sm font-semibold text-[#314158]">
                Confirm email address
              </label>
              <input
                id="confirm-email"
                type="email"
                placeholder="Confirm email address"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className={`${inputClass} ${showEmailMismatch ? "border-red-400 focus:border-red-500" : ""}`}
              />
              {showEmailMismatch && (
                <p className="text-xs text-red-600">
                  Email addresses do not match.
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="new-password" className="text-sm font-semibold text-[#314158]">
                Password
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="New password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Legal text */}
            <div className="flex flex-col gap-3 text-xs text-[#45556c] leading-relaxed">
              <p>
                People who use our service may have uploaded your contact
                information to NookNDen.
              </p>
              <p>
                By tapping Submit, you agree to create an account and to
                NookNDen&apos;s{" "}
                <Link href="/terms" className="font-semibold text-[#009966] hover:underline">Terms</Link>,{" "}
                <Link href="/privacy" className="font-semibold text-[#009966] hover:underline">Privacy Policy</Link>{" "}
                and{" "}
                <Link href="/cookies" className="font-semibold text-[#009966] hover:underline">Cookies Policy</Link>.
              </p>
              <p>
                The{" "}
                <Link href="/privacy" className="font-semibold text-[#009966] hover:underline">Privacy Policy</Link>{" "}
                describes the ways we can use the information you create when you
                create an account. For example, we use this information to
                provide, personalize and improve our products, including ads.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || showEmailMismatch || !confirmEmail}
                className="h-14 bg-gradient-to-r from-[#009966] to-[#009689] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="size-5 animate-spin" />}
                {loading ? "Creating account..." : "Submit"}
              </button>
              <Link
                href="/login"
                className="h-[52px] flex items-center justify-center border-2 border-[#cad5e2] rounded-xl text-base font-semibold text-[#314158] hover:border-[#009966] hover:text-[#009966] transition-colors"
              >
                I already have an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
