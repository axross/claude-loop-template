---
type: Description
description: Delivery-rate calculations, API responses and reporting practices.
---

# Notes

The delivery rate is the number of delivered parcels divided by the number
dispatched during the same reporting week. Cancelled parcels are excluded
from both counts.

The weekly metrics API returns the rate as a decimal between zero and one.
When the denominator is zero, it returns `null`.

The operations team reviews this metric each Monday and records the largest
week-over-week change in its meeting notes.
