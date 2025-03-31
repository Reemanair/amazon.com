import {cart} from '../../data/cart.js';


export function renderCheckoutHeader(){
    let cartquantity = 0;
    cart.forEach((item) => {
      cartquantity += item.quantity;
    });

    const checkout = 
    `<div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="amazon-logo" src="images/amazon-logo.png">
          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link js-checkout"
          href="index.html">${cartquantity}</a>)
      </div>

      <div class="checkout-header-right-section">
        <img src="image/icons/checkout-lock-icon.png">
      </div>
    </div>
  </div>`;

  document.querySelector('.checkout-header').innerHTML=checkout;
}

