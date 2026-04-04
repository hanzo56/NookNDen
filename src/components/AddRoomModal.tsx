"use client";

import { useState, useRef } from "react";
import { X, Loader2, Plus, Camera, MapPin, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { compressImage } from "@/lib/image-utils";

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    const newPhotos = [...photos];

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImage(files[i]);
        const formData = new FormData();
        formData.append("file", compressed);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          setUploadError(data.error || "Failed to upload photo");
          continue;
        }

        const data = await res.json();
        newPhotos.push(data.url);
      } catch {
        setUploadError("Failed to upload photo");
      }
    }

    setPhotos(newPhotos);
    setUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

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
          photos,
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

          {/* Photo Upload */}
          <div className="flex flex-col gap-3">
            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {uploadError}
              </div>
            )}

            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-[#f1f5f9]">
                    <Image
                      src={photo}
                      alt={`Room photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                      className="absolute top-1.5 right-1.5 size-7 rounded-lg bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                    >
                      <Trash2 className="size-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#cad5e2] rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                <div className="size-12 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                  <Camera className="size-6 text-[#90a1b9]" />
                </div>
                <p className="text-base text-[#45556c]">No photos yet</p>
                <p className="text-sm text-[#62748e]">
                  Upload photos to get started
                </p>
              </div>
            )}

            {uploading && (
              <div className="flex items-center justify-center gap-2 py-2 text-[#007a55]">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#f1f5f9] text-[#314158] font-medium text-sm py-3 rounded-xl hover:bg-[#e2e8f0] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Upload className="size-4" />
                Upload Photos
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => cameraInputRef.current?.click()}
                className="bg-[#f1f5f9] text-[#314158] font-medium text-sm py-3 rounded-xl hover:bg-[#e2e8f0] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Camera className="size-4" />
                Take Photo
              </button>
            </div>
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
