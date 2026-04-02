import {
  Tag,
  ShieldCheck,
  Wrench,
  TrendingUp,
  CalendarDays,
  Shield,
  Phone,
  FileText,
  Lock,
} from "lucide-react";

const trackingFeatures = [
  {
    icon: Tag,
    title: "Serial Numbers & Models",
    description:
      "Store complete product information including serial numbers, model numbers, and manufacturer details for quick reference.",
    gradient: "from-[#00bc7d] to-[#009689]",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Tracking",
    description:
      "Never miss a warranty deadline. Track expiration dates and get alerts when warranties are about to expire.",
    gradient: "from-[#00bba7] to-[#0092b8]",
  },
  {
    icon: Wrench,
    title: "Maintenance History",
    description:
      "Log every repair, service call, and maintenance event with dates, descriptions, and costs for complete record keeping.",
    gradient: "from-[#00b8db] to-[#155dfc]",
  },
  {
    icon: TrendingUp,
    title: "Value Preservation",
    description:
      "Maintain detailed records to preserve your home\u2019s value, streamline insurance claims, and simplify property transfers.",
    gradient: "from-[#2b7fff] to-[#9810fa]",
  },
];

const stats = [
  { value: "100%", label: "Complete Coverage", color: "text-[#009966]" },
  { value: "24/7", label: "Access Anytime", color: "text-[#009689]" },
  { value: "\u221E", label: "Unlimited Items", color: "text-[#0092b8]" },
  { value: "\uD83D\uDD12", label: "Secure Storage", color: "text-[#155dfc]" },
];

export default function AssetTracking() {
  return (
    <section className="relative bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] py-20 lg:py-24 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#cbfbf1] text-[#00786f] font-semibold text-sm px-4 py-2 rounded-full mb-4">
            <Tag className="size-4" />
            Complete Asset Tracking
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172b] tracking-tight">
            Track Every Detail
          </h2>
          <p className="mt-5 text-lg md:text-xl text-[#45556c] max-w-3xl mx-auto leading-relaxed">
            From serial numbers to warranty dates, maintain comprehensive records
            for every asset in your home with our powerful tracking system.
          </p>
        </div>

        {/* Content: Example Card + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Example Asset Card */}
          <div className="bg-white border-2 border-[#e2e8f0] rounded-3xl overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#00bc7d] to-[#009689] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#d0fae5]">
                    HVAC System
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Carrier Infinity 24
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="size-4 text-[#d0fae5]" />
                    <span className="text-sm text-[#d0fae5]">
                      Serial: HV-2023-45678
                    </span>
                  </div>
                </div>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  Active
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-[#d0fae5] rounded-[10px] flex items-center justify-center shrink-0">
                  <CalendarDays className="size-5 text-[#009966]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#62748e] uppercase">
                    Purchase Date
                  </p>
                  <p className="text-base font-medium text-[#0f172b]">
                    March 15, 2023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-[#cbfbf1] rounded-[10px] flex items-center justify-center shrink-0">
                  <Shield className="size-5 text-[#009689]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#62748e] uppercase">
                    Warranty Expires
                  </p>
                  <p className="text-base font-medium text-[#0f172b]">
                    March 15, 2033
                  </p>
                  <p className="text-xs font-semibold text-[#009689]">
                    8 years remaining
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-[#cefafe] rounded-[10px] flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-[#0092b8]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#62748e] uppercase">
                    Contact Support
                  </p>
                  <p className="text-base font-medium text-[#0f172b]">
                    1-800-CARRIER
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-[#dbeafe] rounded-[10px] flex items-center justify-center shrink-0">
                  <Wrench className="size-5 text-[#2b7fff]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#62748e] uppercase">
                    Last Maintenance
                  </p>
                  <p className="text-base font-medium text-[#0f172b]">
                    September 10, 2025
                  </p>
                  <p className="text-xs text-[#62748e]">
                    Annual inspection and cleaning - $150
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-[#f3e8ff] rounded-[10px] flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-[#9810fa]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#62748e] uppercase">
                    Notes
                  </p>
                  <p className="text-sm text-[#0f172b]">
                    Annual filter replacement required
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="size-8 bg-[#a4f4cf] rounded-full border-2 border-white" />
                  <div className="size-8 bg-[#96f7e4] rounded-full border-2 border-white" />
                  <div className="size-8 bg-[#a2f4fd] rounded-full border-2 border-white" />
                </div>
                <span className="text-sm text-[#45556c]">
                  3 photos attached
                </span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="flex flex-col justify-center gap-4">
            {trackingFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4"
              >
                <div
                  className={`size-12 bg-gradient-to-br ${feature.gradient} rounded-[14px] shadow-lg flex items-center justify-center shrink-0`}
                >
                  <feature.icon
                    className="size-6 text-white"
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0f172b] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[#45556c] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-6 text-center"
            >
              <p
                className={`text-4xl font-bold ${stat.color} tracking-wide`}
              >
                {stat.value}
              </p>
              <p className="text-sm text-[#45556c] mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
