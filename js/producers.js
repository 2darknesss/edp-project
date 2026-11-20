// Event producers: create events and put them into the queue.
class OrderService {
  constructor(bus) { this.bus = bus; this.nextId = 1; }
  placeOrder(item, quantity) {
    const orderId = this.nextId++;
    this.bus.publish("OrderPlaced", { orderId, item, quantity });
    return orderId;
  }
}

// Simulates an external payment provider (20% random failure).
class PaymentGateway {
  constructor(bus) { this.bus = bus; }
  charge(orderId, item, quantity) {
    const prices = { laptop: 1000, phone: 500, mouse: 20 };
    if (Math.random() < 0.2) {
      this.bus.publish("PaymentFailed", { orderId, reason: "card declined" });
    } else {
      this.bus.publish("PaymentReceived", { orderId, amount: (prices[item] || 10) * quantity });
    }
  }
}
