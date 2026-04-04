"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Hash,
  Calendar,
  ShieldCheck,
  Phone,
  Camera,
  Loader2,
  Save,
  Trash2,
  Package,
  Search,
  X,
  Upload,
  FileText,
  ExternalLink,
  Pencil,
} from "lucide-react";
import Footer from "@/components/Footer";
import type { InventoryItem, Room } from "@/lib/types";
import { compressImage } from "@/lib/image-utils";

const CATEGORIES = [
  "HVAC",
  "Electrical",
  "Appliances",
  "Electronics",
  "Plumbing",
  "Furniture",
  "Other",
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  HVAC: { bg: "bg-[#ffedd4]", text: "text-[#ca3500]" },
  Electrical: { bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Appliances: { bg: "bg-[#f3e8ff]", text: "text-[#8200db]" },
  Electronics: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
  Plumbing: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
  Furniture: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  Other: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
  Uncategorized: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
};

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function isWarrantyExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomSearch, setRoomSearch] = useState("");
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [supportContact, setSupportContact] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [documents, setDocuments] = useState<string[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docUploadError, setDocUploadError] = useState("");

  const roomInputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roomInputRef.current && !roomInputRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchItem();
      fetchRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data.rooms ?? []);
    } catch {
      setRooms([]);
    }
  }

  async function fetchItem() {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${id}`);
      if (!res.ok) {
        setError("Item not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setItem(data.item);
      populateForm(data.item);
    } catch {
      setError("Failed to load item");
    } finally {
      setLoading(false);
    }
  }

  function populateForm(itm: InventoryItem) {
    setName(itm.name);
    setCategory(itm.category);
    setManufacturer(itm.manufacturer || "");
    setModel(itm.model || "");
    setSerialNumber(itm.serial_number || "");
    setSelectedRoom(itm.room || null);
    setRoomSearch("");
    setPurchaseDate(itm.purchase_date || "");
    setWarrantyExpiry(itm.warranty_expiry || "");
    setSupportContact(itm.support_contact || "");
    setNotes(itm.notes || "");
    setPhotos(itm.photos || []);
    setDocuments(itm.documents || []);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
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
          warranty_expiry: warrantyExpiry || null,
          support_contact: supportContact.trim() || null,
          notes: notes.trim() || null,
          photos,
          documents,
        }),
      });

      if (!res.ok) {
        setError("Failed to save changes");
        setSaving(false);
        return;
      }

      const data = await res.json();
      setItem(data.item);
      setEditing(false);
      setSuccess("Changes saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/inventory");
      } else {
        setError("Failed to delete item");
        setDeleting(false);
      }
    } catch {
      setError("Something went wrong");
      setDeleting(false);
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

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || item?.name,
          category: category || item?.category,
          manufacturer: manufacturer || item?.manufacturer || null,
          model: model || item?.model || null,
          serial_number: serialNumber || item?.serial_number || null,
          location: selectedRoom?.name || item?.location || null,
          room_id: selectedRoom?.id || item?.room_id || null,
          purchase_date: purchaseDate || item?.purchase_date || null,
          warranty_expiry: warrantyExpiry || item?.warranty_expiry || null,
          support_contact: supportContact || item?.support_contact || null,
          notes: notes || item?.notes || null,
          photos: newPhotos,
          documents,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
      }
    } catch {
      // Will persist on next save
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  async function handleDeletePhoto(index: number) {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    if (activePhoto >= newPhotos.length) {
      setActivePhoto(Math.max(0, newPhotos.length - 1));
    }

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || item?.name,
          category: category || item?.category,
          manufacturer: manufacturer || item?.manufacturer || null,
          model: model || item?.model || null,
          serial_number: serialNumber || item?.serial_number || null,
          location: selectedRoom?.name || item?.location || null,
          room_id: selectedRoom?.id || item?.room_id || null,
          purchase_date: purchaseDate || item?.purchase_date || null,
          warranty_expiry: warrantyExpiry || item?.warranty_expiry || null,
          support_contact: supportContact || item?.support_contact || null,
          notes: notes || item?.notes || null,
          photos: newPhotos,
          documents,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
      }
    } catch {
      // Will persist on next save
    }
  }

  async function handleDocUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadingDoc(true);
    setDocUploadError("");

    const newDocs = [...documents];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          setDocUploadError(data.error || "Failed to upload document");
          continue;
        }

        const data = await res.json();
        newDocs.push(data.url);
      } catch {
        setDocUploadError("Failed to upload document");
      }
    }

    setDocuments(newDocs);

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || item?.name,
          category: category || item?.category,
          manufacturer: manufacturer || item?.manufacturer || null,
          model: model || item?.model || null,
          serial_number: serialNumber || item?.serial_number || null,
          location: selectedRoom?.name || item?.location || null,
          room_id: selectedRoom?.id || item?.room_id || null,
          purchase_date: purchaseDate || item?.purchase_date || null,
          warranty_expiry: warrantyExpiry || item?.warranty_expiry || null,
          support_contact: supportContact || item?.support_contact || null,
          notes: notes || item?.notes || null,
          photos,
          documents: newDocs,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
      }
    } catch {
      // Will persist on next save
    }

    setUploadingDoc(false);
    if (docInputRef.current) docInputRef.current.value = "";
  }

  async function handleDeleteDoc(index: number) {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs);

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || item?.name,
          category: category || item?.category,
          manufacturer: manufacturer || item?.manufacturer || null,
          model: model || item?.model || null,
          serial_number: serialNumber || item?.serial_number || null,
          location: selectedRoom?.name || item?.location || null,
          room_id: selectedRoom?.id || item?.room_id || null,
          purchase_date: purchaseDate || item?.purchase_date || null,
          warranty_expiry: warrantyExpiry || item?.warranty_expiry || null,
          support_contact: supportContact || item?.support_contact || null,
          notes: notes || item?.notes || null,
          photos,
          documents: newDocs,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
      }
    } catch {
      // Will persist on next save
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="size-8 animate-spin text-[#009966]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] gap-4">
        <p className="text-lg text-[#45556c]">{error || "Item not found"}</p>
        <button
          onClick={() => router.push("/inventory")}
          className="text-[#007a55] font-medium hover:underline cursor-pointer"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const categoryStyle =
    CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.Uncategorized;
  const warrantyExpired = isWarrantyExpired(item.warranty_expiry);
  const hasPhotos = photos.length > 0;

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

        {/* Item Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-xl shadow-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #009966 0%, #007a55 100%)",
              }}
            >
              <Package className="size-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`${categoryStyle.bg} ${categoryStyle.text} text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {item.category}
                </span>
                {warrantyExpired && (
                  <span className="bg-[#ffe2e2] text-[#c10007] text-xs font-semibold px-3 py-1 rounded-full">
                    Warranty Expired
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#0f172b] tracking-tight">
                {item.name}
              </h1>
              {(item.manufacturer || item.model) && (
                <p className="text-base text-[#45556c] mt-0.5">
                  {[item.manufacturer, item.model]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="size-9 flex items-center justify-center bg-white border border-[#e2e8f0] text-[#314158] rounded-lg hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil className="size-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="size-9 flex items-center justify-center bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </button>
          </div>
        </div>

        {success && (
          <div className="bg-[#ecfdf5] border border-[#a4f4cf] text-[#007a55] px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Photos */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-4">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-white" />
                <h2 className="text-xl font-bold text-white">Photos</h2>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {uploadError}
                </div>
              )}

              {hasPhotos ? (
                <div className="flex flex-col gap-4">
                  <div className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={photos[activePhoto]}
                      alt={`${item.name} photo ${activePhoto + 1}`}
                      fill
                      className="object-cover"
                    />
                    {photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-[rgba(15,23,43,0.75)] text-white text-xs font-medium px-3 py-1 rounded-full">
                        {activePhoto + 1} / {photos.length}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(activePhoto)}
                      className="absolute top-3 right-3 size-9 rounded-lg bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                    >
                      <Trash2 className="size-4 text-white" />
                    </button>
                  </div>
                  {photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {photos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`shrink-0 size-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            i === activePhoto
                              ? "border-[#00bc7d] shadow-[0_0_0_2px_#a4f4cf]"
                              : "border-[#e2e8f0]"
                          }`}
                        >
                          <Image
                            src={photo}
                            alt={`Thumbnail ${i + 1}`}
                            width={60}
                            height={60}
                            className="object-cover size-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
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

          {/* Right — Details */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Item Details</h2>
            </div>

            {editing ? (
              <form
                onSubmit={handleSave}
                className="p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#314158]">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#314158]">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#314158]">
                      Model
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#314158]">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
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
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#314158]">
                    Support Contact
                  </label>
                  <input
                    type="text"
                    value={supportContact}
                    onChange={(e) => setSupportContact(e.target.value)}
                    className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#314158]">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-base text-[#0f172b] outline-none focus:border-[#009966] transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#009966] to-[#007a55] text-white font-semibold text-base py-3 rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-60"
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
                    onClick={() => {
                      setEditing(false);
                      if (item) populateForm(item);
                    }}
                    className="bg-[#e2e8f0] text-[#314158] font-semibold text-base px-8 py-3 rounded-xl hover:bg-[#cbd5e1] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 flex flex-col gap-4">
                {item.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-[#009966] shrink-0" />
                    <span className="text-sm text-[#45556c]">Location:</span>
                    {item.room_id ? (
                      <button
                        onClick={() => router.push(`/inventory/rooms/${item.room_id}`)}
                        className="text-sm font-medium text-[#009966] underline decoration-[#009966]/30 hover:decoration-[#009966] transition-colors cursor-pointer"
                      >
                        {item.location}
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-[#009966]">
                        {item.location}
                      </span>
                    )}
                  </div>
                )}
                {item.serial_number && (
                  <div className="flex items-center gap-3">
                    <Hash className="size-5 text-[#45556c] shrink-0" />
                    <span className="text-sm text-[#45556c]">Serial:</span>
                    <span className="text-sm font-mono text-[#0f172b]">
                      {item.serial_number}
                    </span>
                  </div>
                )}
                {item.purchase_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="size-5 text-[#45556c] shrink-0" />
                    <span className="text-sm text-[#45556c]">Purchased:</span>
                    <span className="text-sm text-[#0f172b]">
                      {formatDate(item.purchase_date)}
                    </span>
                  </div>
                )}
                {item.warranty_expiry && (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-[#45556c] shrink-0" />
                    <span className="text-sm text-[#45556c]">
                      Warranty Expires:
                    </span>
                    <span className="text-sm text-[#0f172b]">
                      {formatDate(item.warranty_expiry)}
                    </span>
                  </div>
                )}
                {item.support_contact && (
                  <div className="flex items-center gap-3">
                    <Phone className="size-5 text-[#45556c] shrink-0" />
                    <span className="text-sm text-[#45556c]">Support:</span>
                    <span className="text-sm font-medium text-[#009966]">
                      {item.support_contact}
                    </span>
                  </div>
                )}
                {item.notes && (
                  <div className="border-t border-[#e2e8f0] pt-4 mt-2">
                    <p className="text-sm font-semibold text-[#314158] mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-[#45556c] leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Receipts & Invoices */}
        <div className="mt-8 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#007a55] to-[#016630] px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-white" />
              <h2 className="text-xl font-bold text-white">
                Receipts & Invoices
              </h2>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {docUploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {docUploadError}
              </div>
            )}

            {documents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {documents.map((doc, i) => {
                  const fileName = decodeURIComponent(
                    doc.split("/").pop() || "Document"
                  );
                  const isPdf = doc.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isPdf
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#0f172b] truncate">
                            {fileName}
                          </p>
                          <p className="text-xs text-[#45556c]">
                            {isPdf ? "PDF Document" : "Image"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-8 rounded-lg bg-[#e2e8f0] flex items-center justify-center hover:bg-[#cbd5e1] transition-colors"
                        >
                          <ExternalLink className="size-4 text-[#314158]" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteDoc(i)}
                          className="size-8 rounded-lg bg-[#e2e8f0] flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer text-[#314158]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#cad5e2] rounded-xl py-10 flex flex-col items-center justify-center gap-3">
                <div className="size-12 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                  <FileText className="size-6 text-[#90a1b9]" />
                </div>
                <p className="text-base text-[#45556c]">
                  No receipts or invoices yet
                </p>
                <p className="text-sm text-[#62748e]">
                  Upload PDFs or photos of your receipts
                </p>
              </div>
            )}

            {uploadingDoc && (
              <div className="flex items-center justify-center gap-2 py-3 text-[#007a55]">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            )}

            <input
              ref={docInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleDocUpload(e.target.files)}
            />

            <button
              type="button"
              disabled={uploadingDoc}
              onClick={() => docInputRef.current?.click()}
              className="bg-[#009966] text-white font-medium text-sm py-3 rounded-xl shadow-md hover:bg-[#007a55] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload className="size-4" />
              Upload Receipt / Invoice
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
