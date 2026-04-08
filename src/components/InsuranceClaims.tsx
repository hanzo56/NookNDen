import {
  ShieldAlert,
  FileDown,
  MapPin,
  Camera,
  ClipboardCheck,
  Flame,
  AlertTriangle,
  Droplets,
} from "lucide-react";
import { StaggerChildren, FadeIn } from "@/components/ScrollParallax";

const scenarios = [
  {
    icon: AlertTriangle,
    title: "Burglary",
    description:
      "Instantly generate a report of stolen items with serial numbers, photos, and estimated values.",
    gradient: "from-[#f59e0b] to-[#d97706]",
    bg: "bg-[#fef3c7]",
    text: "text-[#92400e]",
  },
  {
    icon: Flame,
    title: "Fire Damage",
    description:
      "Select affected rooms and produce a complete inventory of damaged or destroyed property.",
    gradient: "from-[#ef4444] to-[#dc2626]",
    bg: "bg-[#fee2e2]",
    text: "text-[#991b1b]",
  },
  {
    icon: Droplets,
    title: "Water Damage",
    description:
      "Document flood or leak damage by room with before-photos and purchase records.",
    gradient: "from-[#3b82f6] to-[#2563eb]",
    bg: "bg-[#dbeafe]",
    text: "text-[#1e40af]",
  },
];

const steps = [
  {
    step: "1",
    icon: MapPin,
    title: "Select Affected Rooms",
    description:
      "Choose which rooms were impacted — the system pulls every item assigned to those locations.",
  },
  {
    step: "2",
    icon: ClipboardCheck,
    title: "Review & Confirm Items",
    description:
      "Verify the auto-generated list. Add or remove items as needed before generating your report.",
  },
  {
    step: "3",
    icon: Camera,
    title: "Photos & Receipts Attached",
    description:
      "All uploaded photos, receipts, and invoices are automatically included as supporting evidence.",
  },
  {
    step: "4",
    icon: FileDown,
    title: "Export Insurance-Ready PDF",
    description:
      "Download a professionally formatted PDF organized by room, ready to submit to your insurance company.",
  },
];

export default function InsuranceClaims() {
  return (
    <section className="relative bg-white py-20 lg:py-24 px-6 overflow-hidden">
      <div className="absolute -top-48 -right-48 size-96 bg-[#dbeafe] rounded-full blur-[64px] opacity-20" />
      <div className="absolute -bottom-48 -left-48 size-96 bg-[#fee2e2] rounded-full blur-[64px] opacity-15" />

      <div className="relative max-w-[1280px] mx-auto">
        <FadeIn direction="up">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#fee2e2] text-[#991b1b] font-semibold text-sm px-4 py-2 rounded-full mb-4">
              <ShieldAlert className="size-4" />
              Insurance Claims
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172b] tracking-tight">
              Be Prepared for the Unexpected
            </h2>
            <p className="mt-5 text-lg md:text-xl text-[#45556c] max-w-3xl mx-auto leading-relaxed">
              When disaster strikes, the last thing you want is to scramble for
              receipts and serial numbers. Nook n&apos; Den automatically
              organizes your inventory by room and generates insurance-ready
              reports in seconds.
            </p>
          </div>
        </FadeIn>

        {/* Scenario Cards */}
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          staggerMs={120}
        >
          {scenarios.map((scenario) => (
            <div
              key={scenario.title}
              className={`${scenario.bg} border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className={`size-12 rounded-xl bg-gradient-to-br ${scenario.gradient} flex items-center justify-center mb-5 shadow-lg`}
              >
                <scenario.icon className="size-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className={`text-lg font-bold ${scenario.text} mb-2`}>
                {scenario.title}
              </h3>
              <p className="text-sm text-[#45556c] leading-relaxed">
                {scenario.description}
              </p>
            </div>
          ))}
        </StaggerChildren>

        {/* How It Works */}
        <FadeIn direction="up">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f172b] tracking-tight">
              How It Works
            </h3>
            <p className="mt-3 text-base text-[#45556c] max-w-xl mx-auto">
              From disaster to documented claim in four simple steps
            </p>
          </div>
        </FadeIn>

        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          staggerMs={100}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-3 -left-3 size-8 rounded-full bg-gradient-to-br from-[#009966] to-[#007a55] flex items-center justify-center text-white text-sm font-bold shadow-md">
                {item.step}
              </div>
              <div className="size-12 rounded-xl bg-gradient-to-br from-[#009966] to-[#007a55] flex items-center justify-center mb-4 mt-2">
                <item.icon className="size-6 text-white" strokeWidth={1.8} />
              </div>
              <h4 className="text-base font-bold text-[#0f172b] mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-[#45556c] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </StaggerChildren>

        {/* CTA Banner */}
        <FadeIn direction="up" delay={200}>
          <div className="bg-gradient-to-r from-[#0f172b] to-[#1e293b] rounded-3xl px-8 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Don&apos;t wait until it&apos;s too late
              </h3>
              <p className="mt-3 text-base text-[#94a3b8] max-w-lg leading-relaxed">
                Start documenting your home inventory today. When you need it
                most, your records will be organized, complete, and ready to
                submit — saving you time, stress, and money.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#009966] to-[#007a55] flex items-center justify-center shadow-xl">
                <ShieldAlert className="size-7 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Peace of Mind</p>
                <p className="text-sm text-[#94a3b8]">
                  Your home, fully documented
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
