import {getOrder} from '../data/orders.js';
import {getproduct, loadProductFetch} from '../data/products.js';
import {loadFromStorage, showcartquantity} from '../data/cart.js'; // Import loadFromStorage and showcartquantity
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  await loadProductFetch();

  // Ensure cart data is loaded and cart quantity is updated in the header
  loadFromStorage();
  showcartquantity(); // Update the cart quantity in the header

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  if (!orderId || !productId) {
    console.error('Missing orderId or productId in the URL.');
    document.querySelector('.js-order-tracking').innerHTML = '<div class="error-message">Invalid tracking information.</div>';
    return;
  }

  const order = getOrder(orderId);
  if (!order) {
    console.error(`Order with ID ${orderId} not found.`);
    document.querySelector('.js-order-tracking').innerHTML = '<div class="error-message">Order not found.</div>';
    return;
  }

  const productDetails = order.products.find(details => details.productid === productId);
  if (!productDetails) {
    console.error(`Product with ID ${productId} not found in order ${orderId}.`);
    document.querySelector('.js-order-tracking').innerHTML = '<div class="error-message">Product not found in the order.</div>';
    return;
  }

  const product = getproduct(productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found in the product catalog.`);
    document.querySelector('.js-order-tracking').innerHTML = '<div class="error-message">Product not found in the catalog.</div>';
    return;
  }

  const estimatedDeliveryTime = productDetails.estimatedDeliveryTime;
  if (!estimatedDeliveryTime) {
    console.error(`Estimated delivery time is missing for product ID ${productId} in order ${orderId}.`);
    document.querySelector('.js-order-tracking').innerHTML = '<div class="error-message">Estimated delivery time is unavailable.</div>';
    return;
  }

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  // Extra feature: display "delivered" on the tracking page
  // if today's date is past the delivery date.
  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
       ${deliveredMessage} ${dayjs(estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
        <div class="progress-label ${
        percentProgress < 50 ? 'current-status' : ''
      }">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
       <div class="progress-label ${
        percentProgress >= 100 ? "current-status" : ''
      }">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

loadPage();