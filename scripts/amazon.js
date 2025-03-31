import {addtocart, cart, showcartquantity,timeset} from '../data/cart.js';
import {products, loadStrorage} from '../data/products.js';

loadStrorage(renderProductsGrid);

function renderProductsGrid(){

let productshtml='';

const url = new URL(window.location.href);
const search = url.searchParams.get('search');

let filteredProducts = products;

// If a search exists in the URL parameters,
// filter the products that match the search.
if (search) {
  filteredProducts = products.filter((product) => {
    let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
  });
}

filteredProducts.forEach((product) => {productshtml+=`<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src= "${product.getStars()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-${product.id}">
            <img src="image/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
});



document.querySelector('.js-products-grid').innerHTML=productshtml;


document.querySelectorAll('.js-add-to-cart').forEach((button)=>{button.addEventListener('click',()=>{const productid=button.dataset.productId;
addtocart(productid);
timeset(productid);
showcartquantity();
   });
});

// Ensure cart quantity is displayed on page load
showcartquantity();

function cartdp() {
  let cartquantity = 0;
  cart.forEach((item) => {
    cartquantity += item.quantity;
  });
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartquantity;
  }
}

cartdp();

document.querySelector('.js-search-button')
.addEventListener('click', () => {
  const search = document.querySelector('.js-search-bar').value;
  window.location.href = `index.html?search=${search}`;
});

document.querySelector('.js-search-bar')
.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = document.querySelector('.js-search-bar').value;
    window.location.href = `index.html?search=${searchTerm}`;
  }
});

}