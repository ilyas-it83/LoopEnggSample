export type LivingSpecificationInspection =
  | {
      valid: true;
      feature: string;
      tags: string[];
      scenarios: string[];
    }
  | {
      valid: false;
      message: string;
    };

export function inspectLivingSpecification(
  source: string,
  requiredTags: string[],
): LivingSpecificationInspection {
  const lines = source.split(/\r?\n/);
  const featureIndex = lines.findIndex((line) => /^\s*Feature:\s*\S/.test(line));

  if (featureIndex === -1) {
    return {
      valid: false,
      message: "Add a Feature declaration before validating this living specification.",
    };
  }

  let tagBlockStart = featureIndex;
  while (tagBlockStart > 0 && lines[tagBlockStart - 1].trim().startsWith("@")) {
    tagBlockStart -= 1;
  }

  const tags = lines
    .slice(tagBlockStart, featureIndex)
    .flatMap((line) => line.trim().split(/\s+/))
    .filter((token) => token.startsWith("@"));
  const missingTags = requiredTags.filter((tag) => !tags.includes(tag));

  if (missingTags.length > 0) {
    return {
      valid: false,
      message: `Missing required feature tags: ${missingTags.join(", ")}. Add them directly above the Feature declaration.`,
    };
  }

  const scenarios = lines.flatMap((line) => {
    const match = line.match(/^\s*Scenario(?: Outline)?:\s*(\S.*)$/);
    return match ? [match[1].trim()] : [];
  });

  if (scenarios.length === 0) {
    return {
      valid: false,
      message: "Add at least one Scenario to make this living specification executable.",
    };
  }

  return {
    valid: true,
    feature: lines[featureIndex].replace(/^\s*Feature:\s*/, "").trim(),
    tags,
    scenarios,
  };
}
