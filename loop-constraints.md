# Drivewise Loop Constraints

## Push and merge

- Never push, close, merge, or enable auto-merge without human approval.
- Create a draft pull request for any proposed code change.

## Protected paths and data

- Never modify `.env`, secrets, credentials, authentication, payment,
  infrastructure, or migration paths without human approval.
- Never expose tokens, personal data, payment data, or repository secrets.

## Code changes

- Run the smallest relevant tests before proposing a fix.
- Never disable or weaken tests to make CI pass.
- Make one focused fix per run and avoid unrelated refactoring.
- Stop after three unsuccessful attempts and escalate with evidence.
- Changes affecting more than ten files require human approval.

## Communication and budget

- Report the intended action before changing repository state.
- At 80% of budget, switch to report-only; at 100%, stop.
- Respect `loop-pause-all` immediately.

