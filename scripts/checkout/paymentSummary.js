import {cart, showcartquantity, savetostorage} from '../../data/cart.js'; // Import savetostorage
import { getproduct } from '../../data/products.js';
import { getdeliveryoption } from '../../data/deliveryoptions.js';
import { formatcurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartquantity = 0;

  cart.forEach((item) => {
    cartquantity += item.quantity;
  });

  cart.forEach((cartitem) => {
    const product = getproduct(cartitem.productid);
    productPriceCents += product.priceCents * cartitem.quantity;

    const deliveryoption = getdeliveryoption(cartitem.deliveryoptionid);
    shippingPriceCents += deliveryoption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `  <div class="payment-summary">
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartquantity}):</div>
            <div class="payment-summary-money">$${formatcurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-payment-summary-shipping">$${formatcurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatcurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatcurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-payment-summary-total">$${formatcurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
        </div>`;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order').addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      });

      const order = await response.json();
      addOrder({
        id: order.id || `order-${Date.now()}`, // Generate an ID if not provided
        orderTime: new Date().toISOString(),
        totalCostCents: cart.reduce((total, item) => {
          const product = getproduct(item.productid);
          return total + (product.priceCents * item.quantity);
        }, 0),
        products: cart.map(item => {
          const deliveryOption = getdeliveryoption(item.deliveryoptionid);
          return {
            productid: item.productid,
            quantity: item.quantity,
            estimatedDeliveryTime: new Date(Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000).toISOString() // Calculate delivery date
          };
        })
      });

      // Clear the cart after placing the order
      cart.length = 0;
      savetostorage(); // Save the updated cart state

      // Redirect to the orders page
      window.location.href = 'orders.html';
    } catch (error) {
      console.error('Unexpected Error: Try again later', error);
    }
  });
}
