import { describe, expect, it } from "vitest";
import { DRIVEWISE_FIXTURE_VERSION, MOCK_CLOCK } from "./fixtures";
import {
  demoApplicationConfig,
  type DemoApplicationConfig,
  validateDemoApplicationConfig,
} from "./demo-config";

describe("demo application configuration", () => {
  it("defines deterministic typed defaults without production dependencies", () => {
    expect(demoApplicationConfig).toEqual({
      fixtureVersion: DRIVEWISE_FIXTURE_VERSION,
      mockClock: MOCK_CLOCK,
      dataSource: "versioned-fixtures",
      stateStore: "browser-local",
      serviceMode: "in-process-mocks",
      demoControlsEnabled: true,
    });
    expect(validateDemoApplicationConfig(demoApplicationConfig)).toEqual([]);
  });

  it("rejects an invalid fixture version and mock clock", () => {
    const invalidConfig: DemoApplicationConfig = {
      ...demoApplicationConfig,
      fixtureVersion: " ",
      mockClock: "not-a-date",
    };

    expect(validateDemoApplicationConfig(invalidConfig)).toEqual([
      "A fixture version is required.",
      "The mock clock must be a valid date and time.",
    ]);
  });
});
