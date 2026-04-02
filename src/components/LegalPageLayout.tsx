import Link from "next/link";
import { ArrowLeft, ScrollText, Shield, Cookie } from "lucide-react";
import { ReactNode } from "react";

const icons = {
  terms: ScrollText,
  privacy: Shield,
  cookies: Cookie,
};

interface LegalPageLayoutProps {
  type: "terms" | "privacy" | "cookies";
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageLayout({
  type,
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const Icon = icons[type];

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        background:
          "linear-gradient(115deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)",
      }}
    >
      <div className="max-w-[896px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base text-[#45556c] hover:text-[#1d293d] transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-[14px] bg-gradient-to-br from-[#009966] to-[#009689] flex items-center justify-center">
              <Icon className="size-6 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-[30px] font-bold text-[#0f172b] tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-sm text-[#62748e]">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-8 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#0f172b] mb-4">{heading}</h2>
      {children}
    </section>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-[#45556c] leading-[26px] mb-3">{children}</p>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-9 space-y-2 mt-2">
      {items.map((item) => (
        <li key={item} className="text-base text-[#45556c] leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ContactBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#ecfdf5] border border-[#a4f4cf] rounded-[10px] p-5 mt-3 text-base text-[#314158] leading-relaxed">
      {children}
    </div>
  );
}
