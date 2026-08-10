import { NextResponse } from "next/server";
import { locations } from "@/lib/fixtures";
import type { MockApiEnvelope, RentalLocation } from "@/lib/types";

export async function GET(): Promise<NextResponse<MockApiEnvelope<RentalLocation[]>>> {
  return NextResponse.json({ data: locations, error: null });
}
