import { validDeliveryOption } from "./deliveryoptions.js";

export let cart; 

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [{
      productid: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryoptionid: '1'
    }, {
      productid: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryoptionid: '2'
    }];
    savetostorage();
  }
}

export function savetostorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function showcartquantity() {
  let cartquantity = 0;
  cart.forEach((item) => {
    cartquantity += item.quantity;
  });
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartquantity;
  }
  const checkoutElement = document.querySelector('.js-checkout');
  if (checkoutElement) {
    checkoutElement.innerHTML = `${cartquantity} items`;
  }
  savetostorage();
}

const addmessagetimeouts = {};
export function timeset(productid) {
  let add;
  let added;

  const previoustimeoutid = addmessagetimeouts[productid];
  add = document.querySelector(`.js-added-${productid}`);
  added = add.classList.add('js-add');

  if (previoustimeoutid) {
    clearTimeout(previoustimeoutid);
  }
  const timeoutid = setTimeout(() => {
    add.classList.remove('js-add');
  }, 2000);

  addmessagetimeouts[productid] = timeoutid;
}

export function addtocart(productid) {
  let select = document.querySelector(`.js-quantity-selector-${productid}`);
  let qnty = select ? Number(select.value) : 1; // Default to 1 if selector is not present
  let matchingitem;
  cart.forEach((item) => {
    if (productid === item.productid) {
      matchingitem = item;
    }
  });
  if (matchingitem) {
    matchingitem.quantity += qnty;
  } else {
    cart.push({
      productid: productid,
      quantity: qnty,
      deliveryoptionid: '1' // Default delivery option
    });
  }
  savetostorage();
}

export function removefromcart(productid) {
  const newcart = [];

  cart.forEach((cartitem) => {
    if (cartitem.productid !== productid) {
      newcart.push(cartitem);
    }
  });

  cart = newcart;
  savetostorage();
}

export function updatequantity(productid, newQuantity) {
  let matchingitem;
  cart.forEach((cartitem) => {
    if (productid === cartitem.productid) {
      matchingitem = cartitem;
      matchingitem.quantity = newQuantity;
      savetostorage();
    }
    else{
      return;
    }
  });
}

export function updateDeliveryoption(productid, deliveryoptionid) {
  let matchingitem;
  cart.forEach((cartitem) => {
    if (productid === cartitem.productid) {
      matchingitem = cartitem;
    }
  });

  if (!matchingitem) {
    return;
  }

  if (!validDeliveryOption(deliveryoptionid)) {
    return;
  }

  matchingitem.deliveryoptionid = deliveryoptionid;
  savetostorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

    fun();

  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

export async function loadCartAsync() {
  try {
    const response = await fetch('https://supersimplebackend.dev/cart');
    if (!response.ok) {
      throw new Error('Failed to fetch cart data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Unexpected Error: Please try again after sometime', error);
    return []; // Return an empty array as a fallback
  }
}