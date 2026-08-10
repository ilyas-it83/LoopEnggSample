# Drivewise Automation Loops

## Active loops

| Pattern | Cadence | Level | Purpose |
| --- | --- | --- | --- |
| Daily triage | Weekdays | L1 | Report CI and repository signals |
| Issue triage | Every two hours on weekdays | L1 | Propose issue organization |
| PR babysitter | Every 15 minutes | L1 | Report stalled or blocked pull requests |
| CI sweeper | Failed CI | L2 | Capture failure context in an isolated worktree |
| Dependency sweeper | Every six hours | L2 | Generate dependency reports in isolation |
| Post-merge cleanup | Main push and nightly | L1 | Report cleanup signals |
| Changelog drafter | Daily | L1 | Draft release notes for human review |

## Safety gates

- Default mode is report-only; no workflow may auto-merge.
- Changes to authentication, payments, secrets, infrastructure, or more than
  ten files require human approval.
- L2 commands run in ephemeral worktrees through `loop-sandbox`.
- A third failed attempt or repeated error escalates to a human.
- GitHub access is least privilege and limited by each workflow's
  `permissions` block. No MCP connector is required.

## Budget and circuit breaker

- Limits are defined in `loop-budget.md`.
- Attempts and failures are read from `loop-ledger.json`.
- Each run invokes `loop-context` before the command.
- `loop-pause-all` is the kill switch. When active, scheduled workflows must
  be disabled by a repository administrator.
- Run outcomes are appended to `loop-run-log.md` when an agent harness is
  connected.

## Worktree isolation

L2 workflows use `loop-sandbox` to execute commands in an ephemeral Git
worktree. Generated patches and reports require human inspection before any
change is applied to the main branch.

## Human escalation

Escalate when the circuit breaker exits with code 2, a budget is exhausted,
the same failure occurs three times, protected paths are involved, or the
requested change exceeds the documented scope.

