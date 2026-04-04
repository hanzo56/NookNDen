"use client";

import { useState } from "react";
import { X, Loader2, Plus, Camera, MapPin } from "lucide-react";

const ROOM_TYPES = [
  "Kitchen",
  "Living Room",
  "Bedroom",
  "Bathroom",
  "Basement",
  "Garage",
  "Attic",
  "Office",
  "Dining Room",
  "Laundry Room",
  "Other",
];

export default function AddRoomModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("Other");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          room_type: roomType,
          photos: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add room");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#007a55] to-[#016630] rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MapPin className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Room</h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Room Details Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#314158]">
                Location Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Basement"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base font-medium text-[#0f172b] placeholder:text-[#90a1b9] outline-none focus:border-[#009966] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#314158]">
                Description
              </label>
              <textarea
                placeholder="Add details about this room..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] placeholder:text-[rgba(10,10,10,0.5)] outline-none focus:border-[#009966] transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#314158]">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors bg-white"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <div className="border-2 border-dashed border-[#cad5e2] rounded-xl p-8 flex flex-col items-center justify-center gap-3">
            <div className="size-12 rounded-full bg-[#f1f5f9] flex items-center justify-center">
              <Camera className="size-6 text-[#90a1b9]" />
            </div>
            <p className="text-base text-[#45556c]">No photos yet</p>
            <p className="text-sm text-[#62748e]">
              Upload photos to get started
            </p>
          </div>

          {/* Photo Tips */}
          <div className="bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] border-2 border-[#a4f4cf] rounded-xl px-6 py-5">
            <p className="text-base font-bold text-[#004f3b] mb-3">
              📸 Photo Tips
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Take photos from multiple angles for complete documentation",
                "Include close-ups of important features and finishes",
                "Ensure good lighting for clearer photos",
                "Update photos when you make changes or renovations",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-sm text-[#006045]"
                >
                  <span className="text-[#009966] font-bold mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base py-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Plus className="size-5" />
              )}
              {loading ? "Saving..." : "Save Room"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#e2e8f0] text-[#314158] font-semibold text-base px-8 py-4 rounded-xl hover:bg-[#cbd5e1] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
