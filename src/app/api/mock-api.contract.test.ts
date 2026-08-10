import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET as getLocations } from "./locations/route";
import { POST as authorizePayment } from "./payments/authorize/route";
import { POST as createQuote } from "./quotes/route";
import {
  GET as searchVehicles,
  SLOW_RESPONSE_MS,
} from "./vehicles/search/route";
import { locations, MOCK_CLOCK } from "@/lib/fixtures";
import { defaultSearch } from "@/lib/rental";
import type {
  MockApiEnvelope,
  MockPaymentAuthorization,
  Quote,
  RentalLocation,
  Vehicle,
} from "@/lib/types";

function request(path: string, body?: unknown): NextRequest {
  return new NextRequest(`http://localhost${path}`, body === undefined ? undefined : {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function envelope<T>(response: Response): Promise<MockApiEnvelope<T>> {
  return await response.json() as MockApiEnvelope<T>;
}

describe("BDD-03 mock API contracts", () => {
  it("returns the deterministic default fixture set without an external service", async () => {
    const response = await getLocations();

    expect(response.status).toBe(200);
    expect(await envelope<RentalLocation[]>(response)).toEqual({
      data: locations,
      error: null,
    });
  });

  it("returns deterministic search and quote success envelopes", async () => {
    const searchResponse = await searchVehicles(request("/api/vehicles/search"));
    const searchBody = await envelope<Vehicle[]>(searchResponse);
    const quoteResponse = await createQuote(request("/api/quotes", {
      search: defaultSearch,
      vehicleId: "compact-1",
    }));

    expect(searchBody.error).toBeNull();
    expect(searchBody.data?.map(({ id }) => id)).toContain("compact-1");
    expect(await envelope<Quote>(quoteResponse)).toMatchObject({
      data: {
        currency: "USD",
        days: 3,
        generatedAt: MOCK_CLOCK,
      },
      error: null,
    });
  });

  it("returns an explicit empty success envelope for the no-results scenario", async () => {
    const response = await searchVehicles(
      request("/api/vehicles/search?scenario=no-results"),
    );

    expect(response.status).toBe(200);
    expect(await envelope<Vehicle[]>(response)).toEqual({
      data: [],
      error: null,
    });
  });

  it("keeps the slow scenario pending for its deterministic latency", async () => {
    vi.useFakeTimers();
    try {
      let settled = false;
      const pendingResponse = searchVehicles(
        request("/api/vehicles/search?scenario=slow"),
      ).then((response) => {
        settled = true;
        return response;
      });

      await vi.advanceTimersByTimeAsync(SLOW_RESPONSE_MS - 1);
      expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1);

      expect((await pendingResponse).status).toBe(200);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("BDD-04 mock API error contracts", () => {
  it("returns field guidance without searching invalid criteria", async () => {
    const response = await searchVehicles(
      request("/api/vehicles/search?driverAge=17"),
    );
    const body = await envelope<Vehicle[]>(response);

    expect(response.status).toBe(400);
    expect(body.data).toBeNull();
    expect(body.error).toMatchObject({
      code: "INVALID_SEARCH",
      message: "Driver age must be between 18 and 90.",
      fields: ["Driver age must be between 18 and 90."],
    });
  });

  it("rejects a quote for an unknown fixture vehicle", async () => {
    const response = await createQuote(request("/api/quotes", {
      search: defaultSearch,
      vehicleId: "unknown",
    }));

    expect(response.status).toBe(400);
    expect(await envelope<Quote>(response)).toEqual({
      data: null,
      error: {
        code: "INVALID_QUOTE",
        message: "Vehicle was not found.",
      },
    });
  });

  it("returns an actionable recovery message for an unavailable service", async () => {
    const response = await searchVehicles(
      request("/api/vehicles/search?scenario=service-error"),
    );
    const body = await envelope<Vehicle[]>(response);

    expect(response.status).toBe(503);
    expect(body.data).toBeNull();
    expect(body.error).toEqual({
      code: "MOCK_SERVICE_UNAVAILABLE",
      message: "The mock vehicle service is unavailable. Change the demo scenario and retry.",
    });
  });

  it.each([
    ["4242424242424242", 200, "approved", null],
    ["4000000000000002", 402, "declined", "PAYMENT_DECLINED"],
    ["5000000000000009", 503, undefined, "PAYMENT_ERROR"],
    ["1234", 400, undefined, "INVALID_TEST_CARD"],
  ] as const)(
    "returns the documented payment envelope for mock card %s",
    async (cardNumber, status, outcome, errorCode) => {
      const response = await authorizePayment(
        request("/api/payments/authorize", { cardNumber }),
      );
      const body = await envelope<MockPaymentAuthorization>(response);

      expect(response.status).toBe(status);
      expect(body.data?.outcome).toBe(outcome);
      expect(body.error?.code ?? null).toBe(errorCode);
    },
  );
});
