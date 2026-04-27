export interface SwiggyItem {
  id: string;
  name: string;
  price: number;
  eta?: number;
  rating?: number;
  imageUrl?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface CartResponse {
  cartId: string;
  items: SwiggyItem[];
  total: number;
  fees: number;
  eta: number;
  provider?: "food" | "instamart" | "dineout";
  requiresConfirmation?: boolean;
}
