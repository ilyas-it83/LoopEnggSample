# Drivewise Loop Budget

| Loop | Maximum runs per day | Maximum tokens per day | Maximum agents per run |
| --- | ---: | ---: | ---: |
| Daily Triage | 2 | 100,000 | 0 |
| Issue Triage | 12 | 80,000 | 0 |
| PR Babysitter | 96 | 2,000,000 | 0 |
| CI Sweeper | 48 | 1,000,000 | 2 |
| Dependency Sweeper | 4 | 500,000 | 2 |
| Post-Merge Cleanup | 2 | 200,000 | 0 |
| Changelog Drafter | 2 | 100,000 | 0 |

At 80% of a daily cap, switch to report-only. At 100%, stop and escalate.
The kill switch is `loop-pause-all`; only a human may raise these limits.

