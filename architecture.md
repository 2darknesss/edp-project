# Architecture

An in-browser, event-driven order processing app. No network and no server: events travel through a local in-memory queue.

```
 Event producers            Event queue                 Event handlers
 ---------------            -----------                 --------------
 OrderService  ──┐                                  ┌─> InventoryHandler
 PaymentGateway ─┼──> EventBus (array queue) ──────>┼─> PaymentHandler
 Handlers*     ──┘     + subscriptions              ├─> ShippingHandler
                                                    ├─> CancellationHandler
                                                    ├─> NotificationHandler
                                                    └─> AuditLogHandler (all events)
```
\* Handlers are also producers: they publish follow-up events.

## Components
- **Event producers** (`js/producers.js`): `OrderService` creates orders when the user clicks "Place order"; `PaymentGateway` simulates a payment provider (20% random failure).
- **Event queue** (`js/eventBus.js`): `EventBus` keeps an array of pending events. `publish()` adds an event; the bus takes events one by one and calls every handler subscribed to that event type.
- **Event handlers** (`js/handlers.js`): small classes reacting to one event each and possibly publishing new ones.
- **Wiring + UI** (`js/main.js`, `index.html`): creates everything and subscribes handlers to events.

## Flow
1. `OrderPlaced` → `InventoryHandler` reserves stock → `InventoryReserved` (or `OutOfStock`).
2. `InventoryReserved` → `PaymentHandler` calls gateway → `PaymentReceived` or `PaymentFailed`.
3. `PaymentReceived` → `ShippingHandler` → `OrderShipped`.
4. `OutOfStock` / `PaymentFailed` → `CancellationHandler` → `OrderCancelled`.
5. `OrderShipped` / `OrderCancelled` → `NotificationHandler` shows a notification.
6. `AuditLogHandler` logs every event.

Producers and handlers never call each other directly. They only know the bus and the event types, so they are loosely coupled.
