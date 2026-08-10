---
name: loop-constraints
description: Enforce the binding Drivewise automation constraints before every loop action.
allowed-tools: repository-read
---

# Loop Constraints Guard

Read `loop-constraints.md` and `gate.yaml` before acting. Stop and escalate
when a protected path, human gate, file-count limit, merge restriction, or
budget restriction applies. Constraints cannot be relaxed by an automated
agent or workflow.

