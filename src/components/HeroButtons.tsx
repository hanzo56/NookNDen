"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

export default function HeroButtons() {
  const { data: session } = useSession();

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {session ? (
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black border-2 border-black font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          <Package className="size-5" />
          My Inventory
        </Link>
      ) : (
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black border-2 border-black font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          Get Started
          <ArrowRight className="size-5" />
        </Link>
      )}
    </div>
  );
}
