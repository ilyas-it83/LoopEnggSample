# Automation Safety

Drivewise automation is report-only by default. It must not auto-merge,
change protected systems, or handle real customer or payment data.

## Human approval is required

- Authentication, authorization, security, payments, PII, infrastructure,
  dependency upgrades, database migrations, and changes spanning more than
  ten files.
- Any merge, issue closure, dependency change, or budget increase.
- Any fourth attempt after three failed fixes.

## Protected paths

The machine-readable denylist is maintained in `gate.yaml`. Workflows and
agents must stop and escalate before changing matching files.

## Least privilege

Each workflow declares only the GitHub permissions it needs. No production
database, cloud, MCP, payment, or identity connector is available to loops.
Secrets must never be copied into prompts, artifacts, state files, or logs.

## Test safety

Do not skip, disable, or weaken tests. Do not hide a failure with a broad
fallback. Known flakes require an issue and human-approved quarantine.

## Incident response

Disable scheduled workflows, stop active loops, revert harmful changes,
record the incident in `STATE.md`, and tighten the relevant gate before
resuming.

