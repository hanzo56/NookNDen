export interface Room {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  room_type: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  location: string | null;
  room_id: string | null;
  room?: Room | null;
  purchase_date: string | null;
  warranty_expiry: string | null;
  support_contact: string | null;
  photos: string[];
  documents: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}
