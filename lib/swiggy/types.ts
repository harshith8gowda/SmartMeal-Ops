export interface SwiggyItem {
  id: string;
  name: string;
  price: number;
  eta?: number;
  rating?: number;
}

export interface CartResponse {
  cartId: string;
  items: SwiggyItem[];
  total: number;
  fees: number;
  eta: number;
}
