import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import '../data/car.js';
import '../data/backend-product.js';
import { loadProductFetch } from '../data/products.js';
import { loadCartAsync } from '../data/cart.js';

Promise.all([loadProductFetch(), loadCartAsync()])
    .then(() => {
        renderCheckoutHeader();
        renderPaymentSummary();
        renderOrderSummary();
    })
    .catch((error) => {
        console.error('Unexpected Error: Please try again after sometime', error);
    });

async function loadPage() {
    try {
        await loadProductFetch();
        await loadCartAsync();
        renderCheckoutHeader();
        renderPaymentSummary();
        renderOrderSummary();
    } catch (error) {
        console.error('Unexpected Error: Please try again after sometime', error);
    }
}

loadPage();









/*Promise.all([
    loadProductFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve('value2');
        });
    })
]).then((values) => {
    console.log(values);
    renderCheckoutHeader();
    renderPaymentSummary();
    renderOrderSummary();
});*/
