class CartManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Cart manager initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
