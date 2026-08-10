# GitHub Actions

These workflows adapt the complete set from
`cobusgreyling/loop-engineering/examples/github-actions` to the Drivewise
Next.js demo.

| Workflow | Trigger | Mode |
| --- | --- | --- |
| Assign Issue to Copilot | `copilot-ready` label, manual | Starts one approved coding-agent task |
| Copilot Review Gate | Pull request changes, manual | Requires a native Copilot review of the current head commit |
| CI | Push, pull request, manual | Type, lint, unit, build, and browser tests |
| Changelog Drafter | Daily, manual | Produces a release-notes artifact |
| CI Sweeper | Failed CI, manual | L2 report on an ephemeral runner |
| Daily Triage | Weekday schedule, manual | L1 report-only |
| Dependency Sweeper | Every six hours, manual | L2 dependency reports on an ephemeral runner |
| Issue Triage | Issue events, schedule, manual | L1 propose-only |
| Post-Merge Cleanup | Main push, nightly, manual | Cleanup-signal report |
| PR Babysitter | Every 15 minutes, manual | L1 report-only |

All loop workflows use minimum GitHub permissions, a controlled ledger,
human gates, and no automatic merge or production write access. The upstream
example requests `loop-sandbox`, but that package is not published in npm;
these two report-only workflows therefore run directly on disposable GitHub
runners and upload only review artifacts.

Copilot assignment requires the `COPILOT_ASSIGNMENT_TOKEN` repository secret.
Only open issues carrying both `user-story` and the human-applied
`copilot-ready` label are eligible. The workflow adds `copilot-assigned` after
successful assignment and is idempotent when Copilot is already assigned.

The same token requests native Copilot code review. The review gate removes a
stale `copilot-reviewed` label after each push, waits for a review tied to the
new head commit, and restores the label only after verification. Configure the
Copilot code-review model or tier in the repository or organization settings;
GitHub does not expose model selection in workflow YAML.
