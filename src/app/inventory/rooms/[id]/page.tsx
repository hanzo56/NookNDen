"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  MapPin,
  Camera,
  Loader2,
  Save,
  Upload,
  Trash2,
  Package,
  ChevronRight,
  FileDown,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/components/Footer";
import type { InventoryItem, Room } from "@/lib/types";

type RoomInventoryRow = Pick<
  InventoryItem,
  | "id"
  | "name"
  | "category"
  | "manufacturer"
  | "model"
  | "serial_number"
  | "location"
  | "purchase_date"
  | "sale_price"
  | "photos"
  | "warranty_expiry"
  | "created_at"
>;
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

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();

  const [room, setRoom] = useState<Room | null>(null);
  const [items, setItems] = useState<RoomInventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("Other");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reportError, setReportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  async function fetchRoom() {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${id}`);
      if (!res.ok) {
        setError("Room not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRoom(data.room);
      setItems(data.items ?? []);
      setName(data.room.name);
      setDescription(data.room.description || "");
      setRoomType(data.room.room_type || "Other");
      setPhotos(data.room.photos || []);
    } catch {
      setError("Failed to load room");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateReport() {
    if (!id || !room) return;
    setReportError("");
    setReporting(true);
    try {
      const res = await fetch(`/api/rooms/${id}/report`);
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setReportError(data?.error || "Could not generate report");
        return;
      }
      const blob = await res.blob();
      const dispo = res.headers.get("Content-Disposition");
      let filename = `${room.name.replace(/\s+/g, "-")}-inventory-report.pdf`;
      const m = dispo?.match(/filename="([^"]+)"/);
      if (m?.[1]) filename = m[1];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setReportError("Could not generate report");
    } finally {
      setReporting(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          room_type: roomType,
          photos,
        }),
      });

      if (!res.ok) {
        setError("Failed to save changes");
        setSaving(false);
        return;
      }

      const data = await res.json();
      setRoom(data.room);
      setSuccess("Changes saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

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

    // Persist to DB
    try {
      await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, room_type: roomType, photos: newPhotos }),
      });
    } catch {
      // Photos saved locally, will persist on next save
    }

    setUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  async function handleDeletePhoto(index: number) {
    if (deletingUrl !== null) return;
    const removedUrl = photos[index];
    const previousPhotos = [...photos];
    const newPhotos = photos.filter((_, i) => i !== index);

    setDeletingUrl(removedUrl);
    setPhotos(newPhotos);
    setUploadError("");

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          room_type: roomType,
          photos: newPhotos,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: removedUrl }),
        });
      } else {
        setPhotos(previousPhotos);
        setUploadError("Could not remove photo. Try again.");
      }
    } catch {
      setPhotos(previousPhotos);
      setUploadError("Could not remove photo. Try again.");
    } finally {
      setDeletingUrl(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="size-8 animate-spin text-[#009966]" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] gap-4">
        <p className="text-lg text-[#45556c]">{error || "Room not found"}</p>
        <button
          onClick={() => router.push("/inventory")}
          className="text-[#007a55] font-medium hover:underline cursor-pointer"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-24 pt-8 pb-16">
        {/* Back link */}
        <button
          onClick={() => router.push("/inventory")}
          className="flex items-center gap-2 text-[#007a55] font-medium text-base mb-6 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-5" />
          Back to Inventory
        </button>

        {/* Room Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="size-12 rounded-xl shadow-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #009966 0%, #007a55 100%)",
              }}
            >
              <MapPin className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#0f172b] tracking-tight">
                {room.name}
              </h1>
              <p className="text-base text-[#45556c]">
                Manage room details and photos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={reporting}
            className="inline-flex items-center justify-center gap-2 self-start bg-[#0f172b] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md hover:bg-[#1e293b] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting ? (
              <Loader2 className="size-5 animate-spin shrink-0" />
            ) : (
              <FileDown className="size-5 shrink-0" />
            )}
            Generate Report (PDF)
          </button>
        </div>
        {reportError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {reportError}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Room Photos */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-4">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-white" />
                <h2 className="text-xl font-bold text-white">Room Photos</h2>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {uploadError}
                </div>
              )}

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, i) => (
                    <div
                      key={`${photo}-${i}`}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[#f1f5f9]"
                    >
                      <Image
                        src={photo}
                        alt={`${room.name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        disabled={deletingUrl !== null}
                        onClick={() => handleDeletePhoto(i)}
                        aria-label="Delete photo"
                        title="Delete photo"
                        className="absolute top-2 right-2 z-10 size-8 rounded-lg bg-black/55 backdrop-blur-[2px] flex items-center justify-center shadow-md transition-colors cursor-pointer hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="size-4 text-white" />
                      </button>
                      {deletingUrl === photo && (
                        <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
                          <Loader2 className="size-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#cad5e2] rounded-xl py-12 flex flex-col items-center justify-center gap-3">
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
                <div className="flex items-center justify-center gap-2 py-3 text-[#007a55]">
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
                  className="bg-[#009966] text-white font-medium text-sm py-3 rounded-xl shadow-md hover:bg-[#007a55] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload className="size-4" />
                  Upload Photos
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-[#0f172b] text-white font-medium text-sm py-3 rounded-xl shadow-md hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Camera className="size-4" />
                  Take Photo
                </button>
              </div>
            </div>
          </div>

          {/* Right — Room Details Form */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-4">
                <h2 className="text-xl font-bold text-white">Room Details</h2>
              </div>
              <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-[#ecfdf5] border border-[#a4f4cf] text-[#007a55] px-4 py-3 rounded-xl text-sm font-medium">
                    {success}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#314158]">
                    Location Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base font-medium text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
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

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#ecfdf5] border-2 border-[#a4f4cf] rounded-xl px-5 py-4">
                    <p className="text-sm font-semibold text-[#007a55]">
                      Total Photos
                    </p>
                    <p className="text-3xl font-bold text-[#004f3b] mt-1">
                      {photos.length}
                    </p>
                  </div>
                  <div className="bg-[#eff6ff] border-2 border-[#bedbff] rounded-xl px-5 py-4">
                    <p className="text-sm font-semibold text-[#1447e6]">
                      Room Type
                    </p>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="text-lg font-bold text-[#1c398e] mt-1 bg-transparent outline-none cursor-pointer"
                    >
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base py-3 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Save className="size-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/inventory")}
                    className="bg-[#e2e8f0] text-[#314158] font-semibold text-base px-8 py-3 rounded-xl hover:bg-[#cbd5e1] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
          </div>
        </div>

        {/* Items assigned to this room (inventory.room_id) */}
        <div className="mt-10 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#0f172b] to-[#1e293b] px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-white" />
              <h2 className="text-xl font-bold text-white">
                Items in this room
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#90a1b9]">
              {items.length} total
            </span>
          </div>
          <div className="p-6">
            {items.length === 0 ? (
              <p className="text-sm text-[#45556c] text-center py-8">
                No inventory items are assigned to this room yet. Assign items
                from an item&apos;s detail page or when adding an item.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((item) => {
                  const thumb = item.photos?.[0];
                  const subtitle = [item.manufacturer, item.model]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/inventory/${item.id}`)
                        }
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#009966] hover:shadow-md transition-all text-left cursor-pointer group"
                      >
                        <div className="relative size-14 shrink-0 rounded-lg overflow-hidden bg-[#e2e8f0]">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="size-6 text-[#90a1b9]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#0f172b] truncate group-hover:text-[#007a55]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#62748e] mt-0.5">
                            {item.category}
                            {subtitle ? ` · ${subtitle}` : ""}
                          </p>
                        </div>
                        <ChevronRight className="size-5 text-[#90a1b9] shrink-0 group-hover:text-[#007a55]" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
