const ORDER_KEY = "buyurtmalar";

export function getOrders() {
  const data = localStorage.getItem(ORDER_KEY);
  return data ? JSON.parse(data) : [];
}

export function addOrder(order) {
  const current = getOrders();
  const updated = [...current, order];
  localStorage.setItem(ORDER_KEY, JSON.stringify(updated));
}

export function clearOrders() {
  localStorage.removeItem(ORDER_KEY);
}
