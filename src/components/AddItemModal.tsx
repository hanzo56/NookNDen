"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, Loader2, Plus, Search, MapPin, DollarSign } from "lucide-react";
import type { Room } from "@/lib/types";
import {
  computeInsuranceStyleAcv,
  formatUsd,
  ACV_DISCLAIMER,
} from "@/lib/depreciation";
import { salePriceFromInput } from "@/lib/sale-price-input";

const CATEGORIES = [
  "HVAC",
  "Electrical",
  "Appliances",
  "Electronics",
  "Plumbing",
  "Furniture",
  "Other",
];

export default function AddItemModal({
  rooms,
  onClose,
  onAdded,
}: {
  rooms: Room[];
  onClose: () => void;
  onAdded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Appliances");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomSearch, setRoomSearch] = useState("");
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [supportContact, setSupportContact] = useState("");
  const [notes, setNotes] = useState("");

  const roomInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        roomInputRef.current &&
        !roomInputRef.current.contains(e.target as Node)
      ) {
        setShowRoomDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.room_type.toLowerCase().includes(roomSearch.toLowerCase())
  );

  const parsedSalePrice = useMemo(
    () => salePriceFromInput(salePrice),
    [salePrice],
  );

  const acvPreview = useMemo(() => {
    if (parsedSalePrice == null) return null;
    return computeInsuranceStyleAcv({
      salePrice: parsedSalePrice,
      purchaseDate: purchaseDate || null,
      category,
    });
  }, [parsedSalePrice, purchaseDate, category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          manufacturer: manufacturer.trim() || null,
          model: model.trim() || null,
          serial_number: serialNumber.trim() || null,
          location: selectedRoom?.name || null,
          room_id: selectedRoom?.id || null,
          purchase_date: purchaseDate || null,
          sale_price: salePriceFromInput(salePrice),
          warranty_expiry: warrantyExpiry || null,
          support_contact: supportContact.trim() || null,
          notes: notes.trim() || null,
          photos: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add item");
        setLoading(false);
        return;
      }

      onAdded();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 pt-8 sm:pt-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto flex flex-col max-h-[90vh]">
        <div className="shrink-0 bg-gradient-to-r from-[#006045] to-[#0d542b] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Item</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#314158]">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Main HVAC Unit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#314158]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g., Carrier"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Model
              </label>
              <input
                type="text"
                placeholder="e.g., Infinity 24"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Serial Number
              </label>
              <input
                type="text"
                placeholder="e.g., HV-2023-45678"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
              />
            </div>

            {/* Room Lookup Field */}
            <div className="flex flex-col gap-1.5" ref={roomInputRef}>
              <label className="text-sm font-semibold text-[#314158]">
                Room / Location
              </label>
              {selectedRoom ? (
                <div className="border-2 border-[#009966] rounded-xl px-4 py-3 flex items-center justify-between bg-[#ecfdf5]">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#009966]" />
                    <span className="text-base font-medium text-[#0f172b]">
                      {selectedRoom.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoom(null);
                      setRoomSearch("");
                    }}
                    className="text-[#45556c] hover:text-[#0f172b] cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-2 border-2 border-[#e2e8f0] rounded-xl px-4 py-3 focus-within:border-[#009966] transition-colors">
                    <Search className="size-4 text-[#90a1b9] shrink-0" />
                    <input
                      type="text"
                      placeholder="Search rooms..."
                      value={roomSearch}
                      onChange={(e) => {
                        setRoomSearch(e.target.value);
                        setShowRoomDropdown(true);
                      }}
                      onFocus={() => setShowRoomDropdown(true)}
                      className="flex-1 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none bg-transparent"
                    />
                  </div>
                  {showRoomDropdown && (
                    <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {filteredRooms.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-[#90a1b9]">
                          {rooms.length === 0
                            ? "No rooms created yet"
                            : "No rooms match your search"}
                        </div>
                      ) : (
                        filteredRooms.map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => {
                              setSelectedRoom(room);
                              setRoomSearch("");
                              setShowRoomDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-[#f1f5f9] transition-colors flex items-center gap-3 cursor-pointer"
                          >
                            <MapPin className="size-4 text-[#009966] shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-[#0f172b]">
                                {room.name}
                              </p>
                              <p className="text-xs text-[#45556c]">
                                {room.room_type}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Warranty Expiry
              </label>
              <input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#314158]">
                Sale price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#62748e] text-base">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="border-2 border-[#e2e8f0] rounded-xl pl-8 pr-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-xl border-2 border-[#bfdbfe] bg-[#eff6ff] p-3 justify-center">
              <p className="text-xs font-semibold text-[#1e3a8a] flex items-center gap-1.5">
                <DollarSign className="size-3.5 shrink-0" />
                Est. insurance ACV
              </p>
              {acvPreview ? (
                <>
                  <p className="text-lg font-bold text-[#0f172b] tabular-nums">
                    {formatUsd(acvPreview.estimatedActualCashValue)}
                  </p>
                  <p className="text-[10px] text-[#62748e] leading-snug mt-1">
                    {ACV_DISCLAIMER}
                  </p>
                </>
              ) : (
                <p className="text-xs text-[#45556c]">
                  Enter price and purchase date for ACV preview.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#314158]">
              Support Contact
            </label>
            <input
              type="text"
              placeholder="e.g., 1-800-CARRIER"
              value={supportContact}
              onChange={(e) => setSupportContact(e.target.value)}
              className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#314158]">
              Notes
            </label>
            <textarea
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5" />
            )}
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
