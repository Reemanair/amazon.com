import { loadFromStorage, validDeliveryOption } from "./cart";

class Cart{
    cartitems= undefined;

    constructor (localStorageKey){
         this.#localStorageKey = localStorageKey;
         this.loadFromStorage();
    }

    loadFromStorage() {
        this.cartitems = JSON.parse(localStorage.getItem(#localStorageKey));
        if (!cart) {
          this.cartitems = [{
            productid: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryoptionid: '1'
          }, {
            productid: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryoptionid: '2'
          }];
          this.savetostorage();
        }
      }

      savetostorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartitems)); }

        showcartquantity() {
            let cartquantity = 0;
            this.cartitems.forEach((item) => {
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
            this.savetostorage();
          }   

          addtocart(productid) {
            let select = document.querySelector(`.js-quantity-selector-${productid}`);
            let qnty = select ? Number(select.value) : 1; // Default to 1 if selector is not present
            let matchingitem;
            this.cartitems.forEach((item) => {
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
            this.savetostorage();
          }

          removefromcart(productid) {
            const newcart = [];
          
            this.cartitems.forEach((cartitem) => {
              if (cartitem.productid !== productid) {
                newcart.push(cartitem);
              }
            });
          
            cart = newcart;
            this.savetostorage();
          }

          updatequantity(productid, newQuantity) {
            let matchingitem;
            this.cartitems.forEach((cartitem) => {
              if (productid === cartitem.productid) {
                matchingitem = cartitem;
                matchingitem.quantity = newQuantity;
                this.savetostorage();
              }
              else{
                return;
              }
            });
          }

          updateDeliveryoption(productid, deliveryoptionid) {
            let matchingitem;
            this.cartitems.forEach((cartitem) => {
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
            this.savetostorage();
          }

          timeset(productid) {
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
}

 const cart = new Cart('cart-oop');
 const buisnesscart = new Cart('cart-buisness'); 

const addmessagetimeouts = {};

console.log(cart);
 





