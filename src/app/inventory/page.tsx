"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Home,
  Plus,
  Search,
  SlidersHorizontal,
  Loader2,
  Package,
  X,
  MapPin,
  LogOut,
} from "lucide-react";
import ItemCard from "@/components/ItemCard";
import AddItemModal from "@/components/AddItemModal";
import AddRoomModal from "@/components/AddRoomModal";
import Footer from "@/components/Footer";
import type { InventoryItem, Room } from "@/lib/types";

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target as Node)
      ) {
        setShowAvatarMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory) params.set("category", activeCategory);

    try {
      const res = await fetch(`/api/inventory?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchItems();
      fetchRooms();
    }
  }, [status, fetchItems, fetchRooms]);

  function handleItemAdded() {
    setShowAddModal(false);
    fetchItems();
  }

  function handleRoomAdded() {
    setShowAddRoomModal(false);
    fetchRooms();
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="size-8 animate-spin text-[#009966]" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#006045] to-[#0d542b] px-6 lg:px-16 pt-8 pb-24">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="size-10 rounded-[10px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Home className="size-6 text-white" strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
                Home Inventory
              </h1>
              <p className="text-base text-[#d0fae5]">
                {items.length} item{items.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/inventory/rooms")}
              className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold text-base px-6 py-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <MapPin className="size-5" />
              My Rooms
            </button>
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold text-base px-6 py-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <MapPin className="size-5" />
              Add Room
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-white text-[#007a55] font-semibold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="size-5" />
              Add Item
            </button>
            {session?.user?.name && (
              <div className="relative" ref={avatarMenuRef}>
                <button
                  onClick={() => setShowAvatarMenu((v) => !v)}
                  className="size-12 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center text-[#006045] font-bold text-lg cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                >
                  {session.user.name.charAt(0).toUpperCase()}
                </button>
                {showAvatarMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {session.user.name}
                      </p>
                      {session.user.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar — overlapping the header */}
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-16 -mt-14">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 border border-[#cad5e2] rounded-xl px-4 py-3 focus-within:border-[#009966] transition-colors">
            <Search className="size-5 text-[#90a1b9] shrink-0" />
            <input
              type="text"
              placeholder="Search by name, manufacturer, model, or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-base text-[#0f172b] placeholder:text-[rgba(10,10,10,0.5)] outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#90a1b9] hover:text-[#45556c] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setActiveCategory("")}
              className={`flex items-center gap-2 font-semibold text-base px-6 py-3 rounded-xl transition-colors cursor-pointer ${
                activeCategory
                  ? "bg-[#009966] text-white"
                  : "bg-[#f1f5f9] text-[#314158] hover:bg-[#e2e8f0]"
              }`}
            >
              <SlidersHorizontal className="size-5" />
              {activeCategory || "Filter"}
            </button>
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setActiveCategory("")}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                !activeCategory
                  ? "bg-[#009966] text-white"
                  : "bg-white text-[#45556c] border border-[#e2e8f0] hover:bg-[#f1f5f9]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? "" : cat)
                }
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#009966] text-white"
                    : "bg-white text-[#45556c] border border-[#e2e8f0] hover:bg-[#f1f5f9]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-16 mt-6">
        <p className="text-sm text-[#45556c]">
          Showing {items.length} of {items.length} items
        </p>
      </div>

      {/* Items Grid */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 lg:px-16 mt-4 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-[#009966]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-20 rounded-2xl bg-[#f1f5f9] flex items-center justify-center mb-4">
              <Package className="size-10 text-[#90a1b9]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172b] mb-2">
              No items yet
            </h3>
            <p className="text-[#45556c] max-w-md">
              Start building your home inventory by adding your first item.
              Track appliances, electronics, HVAC systems, and more.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 flex items-center gap-2 bg-[#009966] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#007a55] transition-colors cursor-pointer"
            >
              <Plus className="size-5" />
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddItemModal
          rooms={rooms}
          onClose={() => setShowAddModal(false)}
          onAdded={handleItemAdded}
        />
      )}

      {showAddRoomModal && (
        <AddRoomModal
          onClose={() => setShowAddRoomModal(false)}
          onAdded={handleRoomAdded}
        />
      )}

      <Footer />
    </div>
  );
}
