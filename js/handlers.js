// Event handlers: react to events, may publish new ones.
class InventoryHandler {
  constructor(bus, onStockChange) {
    this.bus = bus;
    this.onStockChange = onStockChange;
    this.stock = { laptop: 3, phone: 5, mouse: 50 };
  }
  onOrderPlaced(e) {
    const { orderId, item, quantity } = e.data;
    if ((this.stock[item] || 0) >= quantity) {
      this.stock[item] -= quantity;
      this.onStockChange(this.stock);
      this.bus.publish("InventoryReserved", { orderId, item, quantity });
    } else {
      this.bus.publish("OutOfStock", { orderId, item });
    }
  }
}

class PaymentHandler {
  constructor(gateway) { this.gateway = gateway; }
  onInventoryReserved(e) {
    const { orderId, item, quantity } = e.data;
    this.gateway.charge(orderId, item, quantity);
  }
}

class ShippingHandler {
  constructor(bus) { this.bus = bus; }
  onPaymentReceived(e) { this.bus.publish("OrderShipped", { orderId: e.data.orderId }); }
}

class CancellationHandler {
  constructor(bus) { this.bus = bus; }
  onOutOfStock(e) {
    this.bus.publish("OrderCancelled", { orderId: e.data.orderId, reason: e.data.item + " out of stock" });
  }
  onPaymentFailed(e) {
    this.bus.publish("OrderCancelled", { orderId: e.data.orderId, reason: e.data.reason });
  }
}

class NotificationHandler {
  constructor(print) { this.print = print; }
  onShipped(e) { this.print(`Order #${e.data.orderId} has been shipped!`, "ok"); }
  onCancelled(e) { this.print(`Order #${e.data.orderId} cancelled: ${e.data.reason}`, "bad"); }
}

class AuditLogHandler {
  constructor(print) { this.print = print; }
  log(e) {
    this.print(`${e.timestamp.toLocaleTimeString()}  ${e.type}  ${JSON.stringify(e.data)}`);
  }
}
