import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { inspectLivingSpecification } from "./living-specifications";

const specification = readFileSync(
  resolve(process.cwd(), "features/living-specifications.feature"),
  "utf8",
);

describe("DW-149 BDD-04 TDD-01 tagged Gherkin living specifications", () => {
  it("exposes deterministic, traceable acceptance scenarios", () => {
    const requiredTags = ["@DW-149", "@BDD-04", "@TDD-01"];
    const firstInspection = inspectLivingSpecification(specification, requiredTags);
    const secondInspection = inspectLivingSpecification(specification, requiredTags);

    expect(firstInspection).toEqual({
      valid: true,
      feature: "Create tagged Gherkin living specifications",
      tags: ["@DW-149", "@BDD-04", "@TDD-01", "@living-specification"],
      scenarios: [
        "Create tagged Gherkin living specifications succeeds with deterministic mock data",
        "Create tagged Gherkin living specifications handles an invalid or unavailable state",
      ],
    });
    expect(secondInspection).toEqual(firstInspection);
  });

  it("prevents an untraceable specification and provides recovery guidance", () => {
    const result = inspectLivingSpecification(
      "Feature: Untagged behavior\n\n  Scenario: Invalid transition\n    Then it is rejected",
      ["@DW-149", "@BDD-04"],
    );

    expect(result).toEqual({
      valid: false,
      message:
        "Missing required feature tags: @DW-149, @BDD-04. Add them directly above the Feature declaration.",
    });
  });

  it("rejects an empty specification with an actionable message", () => {
    expect(inspectLivingSpecification("", ["@DW-149"])).toEqual({
      valid: false,
      message: "Add a Feature declaration before validating this living specification.",
    });
  });
});
