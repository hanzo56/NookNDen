import Image from "next/image";
import { Home, Package, Camera, MapPin, ImageIcon, Filter } from "lucide-react";
import { StaggerChildren, FadeIn } from "@/components/ScrollParallax";

const ROOM_IMAGES = {
  kitchen:
    "https://www.figma.com/api/mcp/asset/3177467e-3085-44c8-888b-385a322f6e28",
  livingRoom:
    "https://www.figma.com/api/mcp/asset/54aeae06-ee0d-4c32-b836-fc6e1c3ef358",
  bedroom:
    "https://www.figma.com/api/mcp/asset/08b73c10-0872-47af-997f-d167a5c11eb1",
  garage:
    "https://www.figma.com/api/mcp/asset/57217ca0-064c-43ba-a540-7d4d3c1e50f3",
};

const rooms = [
  {
    name: "Kitchen",
    emoji: "🍳",
    items: "12 items",
    image: ROOM_IMAGES.kitchen,
    gradient: "from-[#00bc7d] to-[#00bba7]",
  },
  {
    name: "Living Room",
    emoji: "🛋️",
    items: "8 items",
    image: ROOM_IMAGES.livingRoom,
    gradient: "from-[#00bba7] to-[#00b8db]",
  },
  {
    name: "Bedroom",
    emoji: "🛏️",
    items: "6 items",
    image: ROOM_IMAGES.bedroom,
    gradient: "from-[#00b8db] to-[#2b7fff]",
  },
  {
    name: "Garage",
    emoji: "🚗",
    items: "15 items",
    image: ROOM_IMAGES.garage,
    gradient: "from-[#62748e] to-[#4a5565]",
  },
];

const roomFeatures = [
  {
    icon: MapPin,
    title: "Location Tracking",
    description:
      "Assign items to specific rooms and quickly navigate to see all assets in each location",
    bg: "bg-[#00bc7d]",
    border: "border-[#a4f4cf]",
    gradientBg: "from-[#ecfdf5] to-[#f0fdfa]",
  },
  {
    icon: ImageIcon,
    title: "Room Photo Gallery",
    description:
      "Upload multiple photos for each room to document layout, fixtures, and condition",
    bg: "bg-[#00bba7]",
    border: "border-[#96f7e4]",
    gradientBg: "from-[#f0fdfa] to-[#ecfeff]",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Filter your entire inventory by room to see exactly what\u2019s in each space",
    bg: "bg-[#00b8db]",
    border: "border-[#a2f4fd]",
    gradientBg: "from-[#ecfeff] to-[#eff6ff]",
  },
];

export default function RoomShowcase() {
  return (
    <section className="relative bg-white py-20 lg:py-24 px-6 overflow-x-clip">
      <style>{`
        .room-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .room-card:hover {
          transform: scale(1.25);
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
      `}</style>
      {/* Decorative blurs */}
      <div className="absolute -top-48 -left-48 size-96 bg-[#d0fae5] rounded-full blur-[64px] opacity-20" />
      <div className="absolute -bottom-48 -right-48 size-96 bg-[#cbfbf1] rounded-full blur-[64px] opacity-20" />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header */}
        <FadeIn direction="up">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#d0fae5] text-[#007a55] font-semibold text-sm px-4 py-2 rounded-full mb-4">
              <Home className="size-4" />
              Organize by Room
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172b] tracking-tight">
              Room-Based Organization
            </h2>
            <p className="mt-5 text-lg md:text-xl text-[#45556c] max-w-3xl mx-auto leading-relaxed">
              Create virtual rooms and assign items to specific locations. Track
              everything from your kitchen appliances to garage tools with
              location-based organization.
            </p>
          </div>
        </FadeIn>

        {/* Room Cards */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 overflow-visible" staggerMs={120}>
          {rooms.map((room) => (
            <div
              key={room.name}
              className="room-card bg-white border-2 border-[#f1f5f9] rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${room.gradient} opacity-40`}
                />
                <div className="absolute top-4 right-4 size-12 bg-white/90 rounded-[14px] shadow-lg flex items-center justify-center text-2xl">
                  {room.emoji}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0f172b] mb-2">
                  {room.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[#45556c]">
                  <span className="inline-flex items-center gap-1">
                    <Package className="size-4" />
                    {room.items}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Camera className="size-4" />
                    Photos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>

        {/* Feature Cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerMs={150}>
          {roomFeatures.map((feature) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.gradientBg} border ${feature.border} rounded-2xl p-6`}
            >
              <div
                className={`size-12 ${feature.bg} rounded-[14px] flex items-center justify-center mb-5`}
              >
                <feature.icon className="size-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-[#0f172b] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#45556c] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
