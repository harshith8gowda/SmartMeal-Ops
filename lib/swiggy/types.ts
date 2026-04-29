export interface SwiggyItem {
  id: string;
  name: string;
  price: number;
  eta?: number;
  rating?: number;
  imageUrl?: string;
  metadata?: Record<string, string | number | boolean>;
}

export type SwiggyMcpServer = "food" | "instamart" | "dineout";

export interface SwiggyMcpToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message: string;
  };
}

export interface CartResponse {
  cartId: string;
  items: SwiggyItem[];
  total: number;
  fees: number;
  eta: number;
  provider?: "food" | "instamart" | "dineout";
  requiresConfirmation?: boolean;
  raw?: unknown;
}

export interface DeliveryAddressRef {
  addressId: string;
  label?: string;
  fullAddress?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}
