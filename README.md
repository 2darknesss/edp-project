# EDP Project – Event-Driven Order Processing

A small event-driven web app with a local in-memory event queue (no network, no server).
See `architecture.md` and `events.md`.

## Requirements
Any modern web browser (Chrome, Firefox, Edge, Safari). Nothing to install.

## How to start
1. Clone or download this repository:
   ```bash
   git clone (https://github.com/2darknesss/edp-project)
   ```
2. Open the file `index.html` in your browser (double-click it).
3. Choose an item and quantity, click **Place order**, and watch the events flow through the system in the audit log and notifications.

Tip: order more than the stock (e.g. 10 phones) to see `OutOfStock` → `OrderCancelled`. Payments fail randomly 20% of the time.
