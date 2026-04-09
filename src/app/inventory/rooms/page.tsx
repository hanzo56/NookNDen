"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  DoorOpen,
  Loader2,
  Camera,
  Plus,
} from "lucide-react";
import AddRoomModal from "@/components/AddRoomModal";
import Footer from "@/components/Footer";
import type { Room } from "@/lib/types";

const ROOM_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Kitchen: { bg: "bg-[#ffedd4]", text: "text-[#ca3500]" },
  "Living Room": { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
  Bedroom: { bg: "bg-[#f3e8ff]", text: "text-[#8200db]" },
  Bathroom: { bg: "bg-[#e0f2fe]", text: "text-[#0369a1]" },
  Basement: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
  Garage: { bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Attic: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  Office: { bg: "bg-[#ecfdf5]", text: "text-[#047857]" },
  "Dining Room": { bg: "bg-[#fce7f3]", text: "text-[#be185d]" },
  "Laundry Room": { bg: "bg-[#e0e7ff]", text: "text-[#4338ca]" },
  Other: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
};

export default function RoomsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchRooms();
  }, [status, fetchRooms]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="size-8 animate-spin text-[#009966]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-24 pt-8 pb-16">
        <button
          onClick={() => router.push("/inventory")}
          className="flex items-center gap-2 text-[#007a55] font-medium text-base mb-6 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-5" />
          Back to Inventory
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="size-12 rounded-xl shadow-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #009966 0%, #007a55 100%)",
              }}
            >
              <DoorOpen className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#0f172b] tracking-tight">
                My Rooms
              </h1>
              <p className="text-base text-[#45556c]">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddRoomModal(true)}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto bg-[#009966] text-white font-semibold text-base px-6 py-3 rounded-xl shadow-lg hover:bg-[#007a55] hover:shadow-xl transition-all cursor-pointer"
          >
            <Plus className="size-5" />
            Add Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-16 flex flex-col items-center justify-center gap-4">
            <div className="size-16 rounded-full bg-[#f1f5f9] flex items-center justify-center">
              <DoorOpen className="size-8 text-[#90a1b9]" />
            </div>
            <p className="text-lg text-[#45556c]">No rooms yet</p>
            <p className="text-sm text-[#62748e]">
              Add your first room to organize items by space.
            </p>
            <button
              type="button"
              onClick={() => setShowAddRoomModal(true)}
              className="mt-2 inline-flex items-center gap-2 bg-[#009966] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#007a55] transition-colors cursor-pointer"
            >
              <Plus className="size-5" />
              Add Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const colors =
                ROOM_TYPE_COLORS[room.room_type] ?? ROOM_TYPE_COLORS.Other;
              const hasPhoto = room.photos && room.photos.length > 0;

              return (
                <button
                  key={room.id}
                  onClick={() =>
                    router.push(`/inventory/rooms/${room.id}`)
                  }
                  className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-left"
                >
                  <div className="relative aspect-[16/9] bg-[#f1f5f9]">
                    {hasPhoto ? (
                      <Image
                        src={room.photos[0]}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="size-10 text-[#cad5e2]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${colors.bg} ${colors.text} text-xs font-semibold px-3 py-1 rounded-full`}
                      >
                        {room.room_type}
                      </span>
                    </div>
                    {hasPhoto && room.photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-[rgba(15,23,43,0.75)] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {room.photos.length} photos
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#0f172b] tracking-tight">
                      {room.name}
                    </h3>
                    {room.description && (
                      <p className="text-sm text-[#45556c] mt-1 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showAddRoomModal && (
        <AddRoomModal
          onClose={() => setShowAddRoomModal(false)}
          onAdded={() => {
            setShowAddRoomModal(false);
            fetchRooms();
          }}
        />
      )}

      <Footer />
    </div>
  );
}
