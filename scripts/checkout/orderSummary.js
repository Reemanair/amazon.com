import {cart, removefromcart, updatequantity, showcartquantity} from '../../data/cart.js';
import {getproduct} from '../../data/products.js';
import {formatcurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryoptions,getdeliveryoption,calculateDeliveryDate} from '../../data/deliveryoptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

function deliveryoptionshtml(matchingproduct, cartitem) {
  let html = '';
  deliveryoptions.forEach((deliveryoption) => {
    const datestring = calculateDeliveryDate(deliveryoption);

    const pricestring = deliveryoption.priceCents === 0
      ? 'FREE'
      : `$${formatcurrency(deliveryoption.priceCents)}`;

    const ischecked = deliveryoption.id === cartitem.deliveryoptionid;
    html += `
<div class="delivery-option js-delivery-option-id-${matchingproduct.id}-${deliveryoption.id}">
  <input type="radio" ${ischecked ? 'checked' : ''}
    class="delivery-option-input js-delivery-option-input-${matchingproduct.id}-${deliveryoption.id}"
    name="delivery-option-${matchingproduct.id}"
    data-product-id="${matchingproduct.id}"
    data-delivery-option-id="${deliveryoption.id}">
  <div>
    <div class="delivery-option-date">
      ${datestring}
    </div>
    <div class="delivery-option-price">
      ${pricestring} Shipping
    </div>
  </div>
</div>`;
  });
  return html;
}

export function renderOrderSummary(){

let cartsummary = '';
cart.forEach((cartitem) => {
  const productid = cartitem.productid;

  let matchingproduct = getproduct(productid);

  let deliveryoptionid = cartitem.deliveryoptionid;

  if (!deliveryoptionid) {
    // Set a default delivery option ID if not found
    deliveryoptionid = deliveryoptions[0].id;
    cartitem.deliveryoptionid = deliveryoptionid;
  }

  let deliveryoption = getdeliveryoption(deliveryoptionid);

  if (!deliveryoption) {
    console.error(`Delivery option with ID ${deliveryoptionid} not found`);
    return;
  }

  const datestring = calculateDeliveryDate(deliveryoption);

  cartsummary += `<div class="cart-item-wrapper">
    <div class="cart-item-container js-cart-container js-cart-container-${matchingproduct.id}">
      <div class="delivery-date">
        Delivery date: ${datestring}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingproduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingproduct.id}">
            ${matchingproduct.name}
          </div>
          <div class="product-price js-product-price-${matchingproduct.id}">
            $${matchingproduct.getPrice()}
          </div>
          <div class="product-quantity js-cart-quantity-${matchingproduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingproduct.id}">${cartitem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingproduct.id}">
              Update
            </span> <input class="quantity-input"> <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingproduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link-${matchingproduct.id} js-delete-link" data-product-id="${matchingproduct.id}">
              Delete
            </span>
          </div>
        </div>
      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryoptionshtml(matchingproduct, cartitem)}
      </div>
    </div>
  </div>`;
});

document.querySelector('.js-order-summary').innerHTML = cartsummary;

// Update cart quantity in checkout header
showcartquantity();

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productid = link.dataset.productId;
    removefromcart(productid);

    renderOrderSummary();
    showcartquantity();
    renderPaymentSummary();
  });
});

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productid = link.dataset.productId;
    const container = document.querySelector(`.js-cart-container-${productid}`);
    container.classList.add('is-editing');
  });
});

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productid = link.dataset.productId;
    const save = document.querySelector(`.js-cart-container-${productid}`);
    save.classList.remove('is-editing');
    const input = document.querySelector(`.js-cart-container-${productid} .quantity-input`);
    const newQuantity = Number(input.value);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    updatequantity(productid, newQuantity);

    const quantitylabel = document.querySelector(`.js-quantity-label-${productid}`);
    quantitylabel.innerHTML = newQuantity;
    showcartquantity();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.js-save-link').forEach((link) => {
    const productid = link.dataset.productId;
    const quantityinput = document.querySelector(`.js-cart-container-${productid} .quantity-input`);

    // Click event
    link.addEventListener('click', () => {
      handleUpdateQuantity(productid, quantityinput);
      renderPaymentSummary();
    });

    // Keydown event
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleUpdateQuantity(productid, quantityinput);
        renderPaymentSummary();
      }
    });
  });
});

function handleUpdateQuantity(productid, quantityinput) {
  const newQuantity = Number(quantityinput.value);

  if (newQuantity <= 0 || newQuantity >= 1000) {
    alert('Quantity must be at least 1 and less than 1000');
    return; // early return
  }

  updatequantity(productid, newQuantity);

  const quantityLabel = document.querySelector(`.js-quantity-label-${productid}`);
  quantityLabel.innerHTML = newQuantity;

  showcartquantity();

  const container = document.querySelector(`.js-cart-container-${productid}`);
  container.classList.remove('is-editing');
}

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('delivery-option-input')) {
    const productid = event.target.dataset.productId;
    const deliveryoptionid = event.target.dataset.deliveryOptionId;

    const cartitem = cart.find(item => item.productid === productid);
    if (cartitem) {
      cartitem.deliveryoptionid = deliveryoptionid;
      updateDeliveryDate(productid, deliveryoptionid);renderOrderSummary(); renderPaymentSummary();
    }
  } 
});

function updateDeliveryDate(productid, deliveryoptionid) {
  const deliveryoption = deliveryoptions.find(option => option.id === deliveryoptionid);
  if (deliveryoption) {
    const today = dayjs();
    const deliverydate = today.add(deliveryoption.deliveryDays, 'days');
    const datestring = deliverydate.format('dddd, MMMM D');

    const container = document.querySelector(`.js-cart-container-${productid}`);
    const deliveryDateElement = container.querySelector('.delivery-date');
    deliveryDateElement.innerHTML = `Delivery date: ${datestring}`;
  }
} }




