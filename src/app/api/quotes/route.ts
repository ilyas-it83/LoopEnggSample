import { NextRequest, NextResponse } from "next/server";
import { findVehicle } from "@/lib/fixtures";
import { buildQuote, validateSearch } from "@/lib/rental";
import type { DemoScenario, SearchCriteria, SelectedExtra } from "@/lib/types";

interface QuoteRequest {
  search: SearchCriteria;
  vehicleId: string;
  extras?: SelectedExtra[];
  scenario?: DemoScenario;
}

export async function POST(request: NextRequest) {
  const body = await request.json() as QuoteRequest;
  const errors = validateSearch(body.search);
  const vehicle = findVehicle(body.vehicleId);
  if (!vehicle || errors.length) {
    return NextResponse.json({ data: null, error: { code: "INVALID_QUOTE", message: vehicle ? errors[0] : "Vehicle was not found." } }, { status: 400 });
  }
  return NextResponse.json({ data: buildQuote(body.search, vehicle, body.extras, body.scenario), error: null });
}

