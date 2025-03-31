export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order); // Add the new order to the beginning of the array
  saveToStorage(); // Save the updated orders to local storage
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders)); // Ensure orders are saved correctly
}

export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach(order => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}