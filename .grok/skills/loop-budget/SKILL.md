---
name: loop-budget
description: Enforce Drivewise loop budgets and kill-switch behavior.
allowed-tools: repository-read
---

# Loop Budget Guard

Read `loop-budget.md`, `loop-run-log.md`, and `STATE.md` at the beginning of
each run. Switch to report-only at 80%, exit at 100%, and exit immediately
when `loop-pause-all` is active. Agents cannot increase their own budgets.

