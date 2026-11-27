---
type: Convention
title: Placing a documentation change
description: Which subject owns a new claim about Scheduler.
---

# Placing a documentation change

## Choose a subject

Put a rule where the person making the decision would look for it:

- Scheduling owns a job's observable behavior and the worker mechanism that
  implements it. For a state returned to a caller, update the job contract.
  For a change to how workers coordinate claims, update job dispatch.
- Notifications owns what a recipient receives. If a change determines
  whether a job is terminal, scheduling owns that decision and notification
  rules link to it. If it determines whether to send a message about a
  terminal job, put it with notification rules.
- Operating owns the release operator's sequence, checks and stop conditions.
  Contributing owns practices for people changing the repository or its docs.

Add a subject when readers bring an independent question with no current
owner. Link it from the root, distinguish it from its nearest neighbor here,
and revise this rule if responsibility moves. Within a subject, add a local
index when readers need to choose between several questions.
