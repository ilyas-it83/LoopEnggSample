# GitHub Actions

These workflows adapt the complete set from
`cobusgreyling/loop-engineering/examples/github-actions` to the Drivewise
Next.js demo.

| Workflow | Trigger | Mode |
| --- | --- | --- |
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
