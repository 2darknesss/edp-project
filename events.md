# Events

Events are published to the `EventBus` (`js/eventBus.js`) as `{ type, data, timestamp }`.

| Event | Data | Produced by | Consumed by |
|---|---|---|---|
| `OrderPlaced` | orderId, item, quantity | `OrderService` | `InventoryHandler`, `AuditLogHandler` |
| `InventoryReserved` | orderId, item, quantity | `InventoryHandler` | `PaymentHandler`, `AuditLogHandler` |
| `OutOfStock` | orderId, item | `InventoryHandler` | `CancellationHandler`, `AuditLogHandler` |
| `PaymentReceived` | orderId, amount | `PaymentGateway` | `ShippingHandler`, `AuditLogHandler` |
| `PaymentFailed` | orderId, reason | `PaymentGateway` | `CancellationHandler`, `AuditLogHandler` |
| `OrderShipped` | orderId | `ShippingHandler` | `NotificationHandler`, `AuditLogHandler` |
| `OrderCancelled` | orderId, reason | `CancellationHandler` | `NotificationHandler`, `AuditLogHandler` |
