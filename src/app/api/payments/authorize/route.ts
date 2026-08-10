import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json() as { cardNumber?: string };
  const digits = body.cardNumber?.replace(/\D/g, "") || "";
  if (digits === "4000000000000002") {
    return NextResponse.json({ data: { outcome: "declined" }, error: { code: "PAYMENT_DECLINED", message: "Mock payment was declined." } }, { status: 402 });
  }
  if (digits === "5000000000000009") {
    return NextResponse.json({ data: null, error: { code: "PAYMENT_ERROR", message: "Mock payment processing failed." } }, { status: 503 });
  }
  if (digits !== "4242424242424242") {
    return NextResponse.json({ data: null, error: { code: "INVALID_TEST_CARD", message: "Use a documented mock card number." } }, { status: 400 });
  }
  return NextResponse.json({ data: { outcome: "approved", brand: "Visa", last4: "4242" }, error: null });
}

