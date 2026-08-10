import { NextResponse } from "next/server";
import { locations } from "@/lib/fixtures";

export async function GET() {
  return NextResponse.json({ data: locations, error: null });
}

