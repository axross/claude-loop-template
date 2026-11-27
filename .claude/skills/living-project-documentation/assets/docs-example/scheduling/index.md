# Scheduling

Start here for what happens to one job from creation through its final outcome.

- [What does a run return, and can a repeated worker claim duplicate it?](./jobs.md#creating-a-job)
- [Will editing or disabling a template change work already queued?](./jobs.md#templates-and-schedules)
- [What survives after the job record is pruned?](./jobs.md#output-and-pruning)
- [Can one job start another?](./jobs.md#what-scheduling-does-not-do)
- [Which job states are terminal?](./outcomes.md#states)
- [When does an automatic retry run, and when does it stop?](./outcomes.md#attempts-and-retries)
- [Does the initial attempt count as a retry?](./attempts.md#attempt-budget)
- [How do timers and the API share worker capacity?](./dispatch.md)
