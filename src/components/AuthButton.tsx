"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl">
        <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/login?loggedOut=true" })}
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
      >
        <LogOut className="size-4" />
        Log Out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
    >
      <LogIn className="size-4" />
      Log In
    </Link>
  );
}
