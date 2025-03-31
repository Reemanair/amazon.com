import {getproduct, loadProductFetch} from '../data/products.js';
import {orders} from '../data/orders.js';
import {cart, showcartquantity, loadFromStorage, addtocart, savetostorage} from '../data/cart.js'; // Import addtocart and savetostorage
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatcurrency } from './utils/money.js';

async function loadPage() {
  await loadProductFetch();

  // Ensure cart data is loaded and cart quantity is updated in the header
  loadFromStorage();
  showcartquantity();

  let ordersHTML = '';

  // Filter out invalid orders
  const validOrders = orders.filter(order => order && Array.isArray(order.products));

  if (validOrders.length === 0) {
    ordersHTML = '<div class="no-orders-message">You have no orders yet.</div>';
  } else {
    validOrders.forEach((order) => {
      const orderTimeString = dayjs(order.orderTime).format('MMMM D, YYYY'); // Correct date format

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatcurrency(order.totalCostCents)}</div>
              </div>
            </div>
            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>
          <div class="order-details-grid">
            ${productsListHTML(order)}
          </div>
        </div>
      `;
    });
  }

  function productsListHTML(order) {
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
      const product = getproduct(productDetails.productid);

      if (!product) {
        console.error(`Product with ID ${productDetails.productid} not found.`);
        return;
      }

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${
              dayjs(productDetails.estimatedDeliveryTime).format('MMMM D, YYYY') // Correct date format
            }
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again"
            data-product-id="${product.id}">
            <img class="buy-again-icon" src="image/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  // Add event listeners for "Buy Again" buttons
  document.querySelectorAll('.js-buy-again').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.currentTarget.dataset.productId;
      addtocart(productId); // Add the product to the cart
      savetostorage(); // Save the updated cart state
      showcartquantity(); // Update the cart quantity in the header
      alert('Product added to cart!');
    });
  });
}

loadPage();