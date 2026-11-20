// Local in-memory event queue. Events are processed one by one, asynchronously.
class EventBus {
  constructor() {
    this.queue = [];
    this.handlers = {};
    this.running = false;
  }

  subscribe(eventType, handler) {
    (this.handlers[eventType] = this.handlers[eventType] || []).push(handler);
  }

  publish(type, data = {}) {
    this.queue.push({ type, data, timestamp: new Date() });
    if (!this.running) this._run();
  }

  _run() {
    this.running = true;
    const step = () => {
      const event = this.queue.shift();
      if (!event) { this.running = false; return; }
      for (const handler of this.handlers[event.type] || []) {
        try { handler(event); } catch (e) { console.error("handler failed", e); }
      }
      setTimeout(step, 400); // small delay so the flow is visible in the UI
    };
    setTimeout(step, 0);
  }
}

const EVENTS = [
  "OrderPlaced", "InventoryReserved", "OutOfStock",
  "PaymentReceived", "PaymentFailed", "OrderShipped", "OrderCancelled",
];
