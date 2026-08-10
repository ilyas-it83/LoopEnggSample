import { NextRequest, NextResponse } from "next/server";
import { defaultSearch, searchVehicles, validateSearch } from "@/lib/rental";
import type { DemoScenario, MockApiEnvelope, SearchCriteria, Vehicle } from "@/lib/types";

export const SLOW_RESPONSE_MS = 250;

export async function GET(
  request: NextRequest,
): Promise<NextResponse<MockApiEnvelope<Vehicle[]>>> {
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
  if (scenario === "slow") {
    await new Promise((resolve) => setTimeout(resolve, SLOW_RESPONSE_MS));
  }
  if (scenario === "service-error") {
    return NextResponse.json({
      data: null,
      error: {
        code: "MOCK_SERVICE_UNAVAILABLE",
        message: "The mock vehicle service is unavailable. Change the demo scenario and retry.",
      },
    }, { status: 503 });
  }
  return NextResponse.json({ data: searchVehicles(search, scenario), error: null });
}
