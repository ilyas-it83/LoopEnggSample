import { DRIVEWISE_FIXTURE_VERSION, MOCK_CLOCK } from "./fixtures";

export interface DemoApplicationConfig {
  fixtureVersion: string;
  mockClock: string;
  dataSource: "versioned-fixtures";
  stateStore: "browser-local";
  serviceMode: "in-process-mocks";
  demoControlsEnabled: boolean;
}

export const demoApplicationConfig = {
  fixtureVersion: DRIVEWISE_FIXTURE_VERSION,
  mockClock: MOCK_CLOCK,
  dataSource: "versioned-fixtures",
  stateStore: "browser-local",
  serviceMode: "in-process-mocks",
  demoControlsEnabled: true,
} as const satisfies DemoApplicationConfig;

export function validateDemoApplicationConfig(
  config: DemoApplicationConfig,
): string[] {
  const errors: string[] = [];
  if (!config.fixtureVersion.trim()) {
    errors.push("A fixture version is required.");
  }
  if (!Number.isFinite(Date.parse(config.mockClock))) {
    errors.push("The mock clock must be a valid date and time.");
  }
  return errors;
}
