import Image from "next/image";
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
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

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

const quickLinks = ["Home", "Features", "Inventory", "About Us", "Contact"];
const resources = [
  "Help Center",
  "Documentation",
  "Privacy Policy",
  "Terms of Service",
  "FAQ",
];

export default function LandingPage() {
  return (
    <main className="w-full overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[700px] lg:min-h-[820px] flex flex-col items-center justify-center text-center px-6 py-24 lg:py-32">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,79,59,.85)] via-[rgba(1,102,48,.75)] to-[rgba(11,79,74,.85)]" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto gap-6">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
            <div className="relative size-[88px] lg:size-[114px] rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Home className="size-10 lg:size-14 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            Nook n&apos; Den
          </h1>

          <p className="text-xl md:text-2xl text-[#dbeafe] font-normal">
            Your Home&apos;s Digital DNA
          </p>

          <p className="text-base md:text-lg text-[#bedbff] max-w-xl leading-relaxed">
            A comprehensive platform to track every detail of your
            residence&mdash;from structural data and appliance warranties to
            maintenance history and aesthetic elements. Empower yourself to
            maintain your property&apos;s value and efficiency.
          </p>

          <a
            href="#features"
            className="mt-4 inline-flex items-center gap-2 bg-white text-[#007a55] font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
            <ArrowRight className="size-5" />
          </a>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
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
              <p className="text-base text-[#d0fae5] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
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
              Comprehensive tools to manage your home&apos;s complete inventory
              and maintenance history
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="size-12 rounded-xl bg-gradient-to-br from-[#00bc7d] to-[#009689] flex items-center justify-center mb-5">
                  <feature.icon className="size-6 text-white" strokeWidth={1.8} />
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

      {/* ─── Footer ─── */}
      <footer className="relative bg-gradient-to-br from-[#1d293d] to-[#0f172b] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#00bc7d] via-[#00bba7] to-[#00b8db]" />

        <div className="max-w-[1280px] mx-auto px-6 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-[#00bc7d] to-[#009689] flex items-center justify-center">
                  <Home className="size-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-2xl font-bold text-white">NookNDen</span>
              </div>
              <p className="text-sm text-[#90a1b9] leading-relaxed mb-5 max-w-[260px]">
                Your comprehensive digital inventory platform for residential
                real estate. Track, manage, and preserve your home&apos;s
                complete DNA.
              </p>
              <div className="flex gap-3">
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      aria-label={social}
                      className="size-9 rounded-[10px] bg-[#314158] flex items-center justify-center hover:bg-[#3d5270] transition-colors"
                    >
                      <SocialIcon name={social} />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#90a1b9] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                {resources.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#90a1b9] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Mail className="size-5 text-[#90a1b9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#90a1b9]">Email</p>
                    <p className="text-sm text-white">support@nooknden.com</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="size-5 text-[#90a1b9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#90a1b9]">Phone</p>
                    <p className="text-sm text-white">(555) 123-4567</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="size-5 text-[#90a1b9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#90a1b9]">Address</p>
                    <p className="text-sm text-white">
                      123 Home Street
                      <br />
                      Suite 100
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#314158] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#90a1b9]">
              &copy; 2026 NookNDen. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-[#90a1b9] hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          className="text-[#90a1b9]"
        />
      </svg>
    ),
    twitter: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
          className="text-[#90a1b9]"
        />
      </svg>
    ),
    instagram: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          className="text-[#90a1b9]"
        />
      </svg>
    ),
    linkedin: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          className="text-[#90a1b9]"
        />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}
