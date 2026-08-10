import { NextRequest, NextResponse } from "next/server";
import { defaultSearch, searchVehicles, validateSearch } from "@/lib/rental";
import type { DemoScenario, SearchCriteria } from "@/lib/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search: SearchCriteria = {
    pickupLocationId: params.get("pickupLocationId") || defaultSearch.pickupLocationId,
    returnLocationId: params.get("returnLocationId") || defaultSearch.returnLocationId,
    pickupAt: params.get("pickupAt") || defaultSearch.pickupAt,
    returnAt: params.get("returnAt") || defaultSearch.returnAt,
    driverAge: Number(params.get("driverAge") || defaultSearch.driverAge),
  };
  const errors = validateSearch(search);
  if (errors.length) {
    return NextResponse.json({ data: null, error: { code: "INVALID_SEARCH", message: errors[0], fields: errors } }, { status: 400 });
  }
  const scenario = (params.get("scenario") || "normal") as DemoScenario;
  return NextResponse.json({ data: searchVehicles(search, scenario), error: null });
}

