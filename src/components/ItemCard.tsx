"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Hash,
  Calendar,
  ShieldCheck,
  Phone,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import type { InventoryItem } from "@/lib/types";

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  HVAC: { bg: "bg-[#ffedd4]", text: "text-[#ca3500]" },
  Electrical: { bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Appliances: { bg: "bg-[#f3e8ff]", text: "text-[#8200db]" },
  Electronics: { bg: "bg-[#f1f5f9]", text: "text-[#314158]" },
  Plumbing: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
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

export default function ItemCard({ item }: { item: InventoryItem }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const categoryStyle =
    CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.Uncategorized;
  const warrantyExpired = isWarrantyExpired(item.warranty_expiry);
  const hasPhotos = item.photos && item.photos.length > 0;

  return (
    <div
      onClick={() => router.push(`/inventory/${item.id}`)}
      className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
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
            <h3 className="text-xl font-bold text-[#0f172b] tracking-tight">
              {item.name}
            </h3>
            {(item.manufacturer || item.model) && (
              <p className="text-sm text-[#45556c] mt-0.5">
                {[item.manufacturer, item.model].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 size-9 rounded-lg flex items-center justify-center hover:bg-[#f1f5f9] transition-colors"
          >
            <MoreVertical className="size-5 text-[#45556c]" />
          </button>
        </div>

        {/* Photos */}
        {hasPhotos && (
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={item.photos[activePhoto]}
                alt={`${item.name} photo ${activePhoto + 1}`}
                fill
                className="object-cover"
              />
              {item.photos.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-[rgba(15,23,43,0.75)] text-white text-xs font-medium px-3 py-1 rounded-full">
                  {activePhoto + 1} / {item.photos.length}
                </div>
              )}
            </div>
            {item.photos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {item.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActivePhoto(i); }}
                    className={`shrink-0 size-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activePhoto
                        ? "border-[#00bc7d] shadow-[0_0_0_2px_#a4f4cf]"
                        : "border-[#e2e8f0]"
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${item.name} thumbnail ${i + 1}`}
                      width={60}
                      height={60}
                      className="object-cover size-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="flex flex-col gap-3">
          {item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#45556c] shrink-0" />
              <span className="text-sm text-[#45556c]">Location:</span>
              {item.room_id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/inventory/rooms/${item.room_id}`);
                  }}
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
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-[#45556c] shrink-0" />
              <span className="text-sm text-[#45556c]">Serial:</span>
              <span className="text-sm font-mono text-[#0f172b]">
                {item.serial_number}
              </span>
            </div>
          )}
          {item.purchase_date && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#45556c] shrink-0" />
              <span className="text-sm text-[#45556c]">Purchased:</span>
              <span className="text-sm text-[#0f172b]">
                {formatDate(item.purchase_date)}
              </span>
            </div>
          )}
          {item.warranty_expiry && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#45556c] shrink-0" />
              <span className="text-sm text-[#45556c]">Warranty Expires:</span>
              <span className="text-sm text-[#0f172b]">
                {formatDate(item.warranty_expiry)}
              </span>
            </div>
          )}
          {item.support_contact && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-[#45556c] shrink-0" />
              <span className="text-sm text-[#45556c]">Support:</span>
              <span className="text-sm font-medium text-[#009966]">
                {item.support_contact}
              </span>
            </div>
          )}
        </div>

        {/* Expandable details */}
        {item.notes && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="flex items-center justify-between border-t border-[#e2e8f0] pt-3 cursor-pointer"
            >
              <span className="text-sm font-semibold text-[#314158]">
                Show Details
              </span>
              {expanded ? (
                <ChevronUp className="size-4 text-[#314158]" />
              ) : (
                <ChevronDown className="size-4 text-[#314158]" />
              )}
            </button>
            {expanded && (
              <p className="text-sm text-[#45556c] leading-relaxed">
                {item.notes}
              </p>
            )}
          </>
        )}
        {!item.notes && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="flex items-center justify-between border-t border-[#e2e8f0] pt-3 cursor-pointer"
          >
            <span className="text-sm font-semibold text-[#314158]">
              Show Details
            </span>
            {expanded ? (
              <ChevronUp className="size-4 text-[#314158]" />
            ) : (
              <ChevronDown className="size-4 text-[#314158]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
