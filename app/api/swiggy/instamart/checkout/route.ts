import { NextRequest, NextResponse } from "next/server";
import { checkoutGroceries } from "@/lib/swiggy/instamart";

export async function POST(req: NextRequest) {
  const { addressId = "addr_demo_home", paymentMethod, confirmed } = await req.json();

  if (!confirmed) {
    return NextResponse.json({ error: "User confirmation is required before Instamart checkout." }, { status: 400 });
  }

  const order = await checkoutGroceries(addressId, paymentMethod);
  return NextResponse.json(order);
}
