import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Camera,
  Hash,
  ShieldCheck,
  Wrench,
  Search,
  FileText,
  ShoppingBag,
  Home,
} from "lucide-react";
import Footer from "@/components/Footer";
import AuthButton from "@/components/AuthButton";
import RoomShowcase from "@/components/RoomShowcase";
import AssetTracking from "@/components/AssetTracking";
import {
  ParallaxBackground,
  HeroContent,
  ScrollReveal,
} from "@/components/ScrollParallax";

const HERO_BG =
  "https://www.figma.com/api/mcp/asset/54c7bde6-62ed-4c4b-99db-f5349d369187";

const features = [
  {
    icon: ClipboardList,
    title: "Centralized Inventory",
    description:
      "Store all your home assets in one secure, organized location. Never lose track of important details again.",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    description:
      "Upload and attach photos to each item for visual reference and insurance purposes.",
  },
  {
    icon: Hash,
    title: "Serial Number Tracking",
    description:
      "Record serial numbers, model information, and manufacturer details for every asset.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Management",
    description:
      "Track warranty expiration dates and keep contact information for product support readily available.",
  },
  {
    icon: Wrench,
    title: "Maintenance History",
    description:
      "Log repairs, maintenance events, and associated costs to maintain your property\u2019s value.",
  },
  {
    icon: Search,
    title: "Smart Search & Filter",
    description:
      "Quickly find any item with powerful search and category filtering capabilities.",
  },
  {
    icon: FileText,
    title: "Detailed Records",
    description:
      "Add notes, specifications, and custom information for each asset in your home.",
  },
  {
    icon: ShoppingBag,
    title: "Purchase Tracking",
    description:
      "Record purchase dates and track the age of your appliances and systems.",
  },
];

export default function LandingPage() {
  return (
    <main className="w-full overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[700px] lg:min-h-[820px] flex flex-col items-center justify-center text-center px-6 py-24 lg:py-32 overflow-hidden">
        <ParallaxBackground>
          <Image src={HERO_BG} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(154,52,0,.85)] via-[rgba(194,80,0,.75)] to-[rgba(180,83,9,.85)]" />
        </ParallaxBackground>

        <AuthButton />

        <HeroContent className="relative z-10 flex flex-col items-center max-w-3xl mx-auto gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
            <div className="relative size-[88px] lg:size-[114px] rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Home
                className="size-10 lg:size-14 text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            Nook n&apos; Den
          </h1>

          <p className="text-xl md:text-2xl text-[#fed7aa] font-normal">
            Your Home&apos;s Digital DNA
          </p>

          <p className="text-base md:text-lg text-[#fdba74] max-w-xl leading-relaxed">
            A comprehensive platform to track every detail of your
            residence&mdash;from structural data and appliance warranties to
            maintenance history and aesthetic elements. Empower yourself to
            maintain your property&apos;s value and efficiency.
          </p>

          <Link
            href="/register"
            className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-black border-2 border-black font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
            <ArrowRight className="size-5" />
          </Link>
        </HeroContent>

        <HeroContent className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { value: "100%", label: "Centralized" },
            { value: "\u221E", label: "Inventory Items" },
            { value: "24/7", label: "Access" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 border border-white/20 rounded-2xl px-6 py-6 text-center"
            >
              <p className="text-3xl lg:text-4xl font-bold text-white tracking-wide">
                {stat.value}
              </p>
              <p className="text-base text-[#ffedd5] mt-1">{stat.label}</p>
            </div>
          ))}
        </HeroContent>
      </section>

      {/* ─── Features ─── */}
      <ScrollReveal>
        <section
          id="features"
          className="relative bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] py-20 lg:py-24 px-6"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172b] tracking-tight">
                Everything You Need
              </h2>
              <p className="mt-5 text-lg md:text-xl text-[#45556c] max-w-xl mx-auto leading-relaxed">
                Comprehensive tools to manage your home&apos;s complete
                inventory and maintenance history
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#00bc7d] to-[#009689] flex items-center justify-center mb-5">
                    <feature.icon
                      className="size-6 text-white"
                      strokeWidth={1.8}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f172b] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#45556c] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <RoomShowcase />
      </ScrollReveal>

      <ScrollReveal>
        <AssetTracking />
      </ScrollReveal>
      <Footer />
    </main>
  );
}
