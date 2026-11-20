// Wiring: create the bus, producers, handlers and subscribe handlers to events.
const $ = (id) => document.getElementById(id);

function addLine(listId, text, cls = "") {
  const li = document.createElement("li");
  li.textContent = text;
  if (cls) li.className = cls;
  $(listId).prepend(li);
}

function showStock(stock) {
  $("stock").textContent = Object.entries(stock).map(([k, v]) => `${k}: ${v}`).join("   |   ");
}

const bus = new EventBus();
const orders = new OrderService(bus);
const gateway = new PaymentGateway(bus);

const inventory = new InventoryHandler(bus, showStock);
const payment = new PaymentHandler(gateway);
const shipping = new ShippingHandler(bus);
const cancellation = new CancellationHandler(bus);
const notification = new NotificationHandler((t, c) => addLine("notifications", t, c));
const audit = new AuditLogHandler((t) => addLine("audit", t));

bus.subscribe("OrderPlaced", (e) => inventory.onOrderPlaced(e));
bus.subscribe("InventoryReserved", (e) => payment.onInventoryReserved(e));
bus.subscribe("PaymentReceived", (e) => shipping.onPaymentReceived(e));
bus.subscribe("OutOfStock", (e) => cancellation.onOutOfStock(e));
bus.subscribe("PaymentFailed", (e) => cancellation.onPaymentFailed(e));
bus.subscribe("OrderShipped", (e) => notification.onShipped(e));
bus.subscribe("OrderCancelled", (e) => notification.onCancelled(e));
for (const type of EVENTS) bus.subscribe(type, (e) => audit.log(e));

showStock(inventory.stock);

$("orderForm").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const item = $("item").value;
  const quantity = parseInt($("quantity").value, 10) || 1;
  orders.placeOrder(item, quantity);
});
