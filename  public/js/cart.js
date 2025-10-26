class CartManager {
    constructor() {
        this.items = [];
        this.isInitialized = false;
        this.init();
    }

    async init() {
        await this.loadCart();
        this.bindEvents();
        this.isInitialized = true;
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                this.addToCart(button.dataset);
            }
        });

        // Cart page events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-quantity')) {
                this.updateQuantity(e.target);
            } else if (e.target.classList.contains('remove-item')) {
                this.removeItem(e.target);
            } else if (e.target.id === 'clear-cart-btn') {
                this.clearCart();
            } else if (e.target.id === 'checkout-btn') {
                this.checkout();
            }
        });

        // Quantity input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-quantity')) {
                this.updateItemQuantity(e.target);
            }
        });
    }

    async loadCart() {
        try {
            // Check if user is authenticated
            if (window.authManager && window.authManager.isAuthenticated()) {
                const response = await fetch('/api/cart');
                const data = await response.json();

                if (data.success) {
                    this.items = data.data.items;
                }
            } else {
                // Fallback to localStorage for guest users
                const savedCart = localStorage.getItem('guestCart');
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                }
            }
            this.updateCartUI();
        } catch (error) {
            console.error('Load cart error:', error);
        }
    }

    async addToCart(productData) {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showNotification('Please login to add items to cart', 'error');
            return;
        }

        const product = {
            productId: parseInt(productData.id),
            name: productData.name,
            price: parseFloat(productData.price),
            quantity: 1
        };

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.productId,
                    quantity: product.quantity
                })
            });

            const data = await response.json();

            if (data.success) {
                await this.loadCart(); // Reload cart from server
                this.showNotification('Product added to cart!', 'success');
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showNotification('Failed to add product to cart', 'error');
        }
    }

    async updateQuantity(button) {
        const itemId = button.dataset.itemId;
        const change = parseInt(button.dataset.change);

        const item = this.items.find(item => item.productId === parseInt(itemId));
        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity < 1) return;

        await this.updateItemQuantityDirect(itemId, newQuantity);
    }

    async updateItemQuantity(input) {
        const itemId = input.dataset.itemId;
        const newQuantity = parseInt(input.value);

        if (newQuantity < 1) return;

        await this.updateItemQuantityDirect(itemId, newQuantity);
    }

    async updateItemQuantityDirect(itemId, quantity) {
        try {
            const response = await fetch(`/api/cart/update/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();

            if (data.success) {
                await this.loadCart();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            this.showNotification('Failed to update quantity', 'error');
        }
    }

    async removeItem(button) {
        const itemId = button.dataset.itemId;

        if (!confirm('Are you sure you want to remove this item from cart?')) {
            return;
        }

        try {
            const response = await fetch(`/api/cart/remove/${itemId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                await this.loadCart();
                this.showNotification('Item removed from cart', 'success');
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Remove item error:', error);
            this.showNotification('Failed to remove item', 'error');
        }
    }

    async clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) {
            return;
        }

        try {
            const response = await fetch('/api/cart/clear', {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.items = [];
                this.updateCartUI();
                this.showNotification('Cart cleared successfully', 'success');
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Clear cart error:', error);
            this.showNotification('Failed to clear cart', 'error');
        }
    }

    async checkout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // In a real app, you would show a checkout form
        // For now, we'll create an order directly
        try {
            const orderData = {
                items: this.items.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity
                })),
                customer_name: 'John Doe', // This would come from a form
                customer_email: 'john@example.com', // This would come from a form
                customer_phone: '+1234567890', // This would come from a form
                delivery_address: '123 Main St, City, Country' // This would come from a form
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                await this.clearCart();
                this.showNotification('Order placed successfully!', 'success');

                // Redirect to orders page
                setTimeout(() => {
                    window.location.href = '/orders';
                }, 2000);
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Checkout failed', 'error');
        }
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartPage();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    updateCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';

        // Update cart items
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.productId}">
                <div class="item-image">
                    <img src="${item.product.image_url || '/images/placeholder.jpg'}" alt="${item.product.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.product.name}</h3>
                    <p class="item-price">$${item.product.price}</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.productId}" data-change="-1">-</button>
                        <input type="number" class="item-quantity" data-item-id="${item.productId}" value="${item.quantity}" min="1">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.productId}" data-change="1">+</button>
                    </div>
                    <div class="item-total">
                        $${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="btn btn-danger remove-item" data-item-id="${item.productId}">Remove</button>
                </div>
            </div>
        `).join('');

        // Update cart summary
        const total = this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);

        if (cartSummary) {
            cartSummary.innerHTML = `
                <div class="summary-row">
                    <span>Total Items:</span>
                    <span>${totalItems}</span>
                </div>
                <div class="summary-row total">
                    <span>Total Amount:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <button id="checkout-btn" class="btn btn-success btn-lg">Proceed to Checkout</button>
            `;
        }
    }

    getCartSummary() {
        const total = this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            totalItems,
            totalAmount: total,
            itemCount: this.items.length
        };
    }

    showNotification(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});