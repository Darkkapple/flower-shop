/**
 * Cart Manager for Flower Shop
 * Handles shopping cart functionality
 */

class CartManager {
    constructor() {
        this.items = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        console.log('🛒 Cart Manager initializing...');
        this.loadCart();
        this.bindCartEvents();
        
        this.isInitialized = true;
        console.log('🛒 Cart Manager initialized successfully');
    }

    bindCartEvents() {
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

    loadCart() {
        try {
            const savedCart = localStorage.getItem('flowerShopCart');
            this.items = savedCart ? JSON.parse(savedCart) : [];
            console.log('Cart loaded:', this.items.length, 'items');
            this.updateCartUI();
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('flowerShopCart', JSON.stringify(this.items));
            console.log('Cart saved:', this.items.length, 'items');
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addToCart(productData, quantity = 1) {
        if (!productData.id || !productData.name || !productData.price) {
            console.error('Invalid product data:', productData);
            this.showNotification('Error adding product to cart', 'error');
            return false;
        }

        const product = {
            id: parseInt(productData.id),
            name: productData.name,
            price: parseFloat(productData.price),
            quantity: quantity,
            image: productData.image || '/images/placeholder.jpg'
        };

        // Check if product already in cart
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity
            this.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`Added ${product.name} to cart!`, 'success');

        return true;
    }

    updateQuantity(button) {
        const itemId = parseInt(button.dataset.itemId);
        const change = parseInt(button.dataset.change);
        
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            this.showNotification('Quantity cannot be less than 1', 'warning');
            return;
        }

        if (newQuantity > 50) {
            this.showNotification('Maximum quantity is 50', 'warning');
            return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartUI();
    }

    updateItemQuantity(input) {
        const itemId = parseInt(input.dataset.itemId);
        const newQuantity = parseInt(input.value);

        if (newQuantity < 1) {
            this.showNotification('Quantity cannot be less than 1', 'warning');
            input.value = 1;
            return;
        }

        if (newQuantity > 50) {
            this.showNotification('Maximum quantity is 50', 'warning');
            input.value = 50;
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    removeItem(button) {
        const itemId = parseInt(button.dataset.itemId);
        const item = this.items.find(item => item.id === itemId);
        
        if (!item) return;

        if (!confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
            return;
        }

        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item removed from cart', 'success');
    }

    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is already empty', 'info');
            return;
        }

        if (!confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Cart cleared successfully', 'success');
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showNotification('Please login to proceed with checkout', 'warning');
            setTimeout(() => {
                window.location.href = '/login?returnUrl=/cart';
            }, 1500);
            return;
        }

        // Simulate checkout process
        this.showNotification('Proceeding to checkout...', 'info');
        
        // In a real app, you would redirect to checkout page
        setTimeout(() => {
            this.showNotification('Checkout functionality coming soon!', 'success');
        }, 2000);
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartPage();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (element.parentElement) {
                element.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    }

    updateCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartActions = document.getElementById('cart-actions');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            // Show empty cart message
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
            if (cartActions) cartActions.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        // Hide empty message, show cart items
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        if (cartActions) cartActions.style.display = 'flex';
        if (cartSummary) cartSummary.style.display = 'block';

        // Update cart items
        this.renderCartItems(cartItemsContainer);
        
        // Update cart summary
        this.updateCartSummary();
    }

    renderCartItems(container) {
        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="item-image">
                    <div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">
                        🌸
                    </div>
                </div>
                <div class="item-details">
                    <h3 class="item-name">${this.escapeHtml(item.name)}</h3>
                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.id}" data-change="-1">-</button>
                        <input type="number" class="item-quantity" data-item-id="${item.id}" value="${item.quantity}" min="1" max="50">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.id}" data-change="1">+</button>
                    </div>
                    <div class="item-total">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="btn btn-danger remove-item" data-item-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Add basic styles if not present
        this.ensureCartStyles();
    }

    updateCartSummary() {
        const subtotalElement = document.getElementById('subtotal-amount');
        const totalElement = document.getElementById('total-amount');
        const deliveryFeeElement = document.getElementById('delivery-fee');
        const taxElement = document.getElementById('tax-amount');

        if (!subtotalElement || !totalElement) return;

        const subtotal = this.getSubtotal();
        const deliveryFee = subtotal > 50 ? 0 : 9.99; // Free delivery over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + deliveryFee + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    ensureCartStyles() {
        if (document.querySelector('#cart-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cart-styles';
        styles.textContent = `
            .cart-item {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 1.5rem;
                padding: 1.5rem;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                margin-bottom: 1rem;
                align-items: center;
            }
            
            .quantity-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .item-quantity {
                width: 60px;
                text-align: center;
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 4px;
            }
            
            .item-total {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--accent-color);
            }
            
            @media (max-width: 768px) {
                .cart-item {
                    grid-template-columns: 1fr;
                    text-align: center;
                }
                
                .item-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartSummary() {
        return {
            totalItems: this.getTotalItems(),
            subtotal: this.getSubtotal(),
            itemCount: this.items.length
        };
    }

    showNotification(message, type = 'info') {
        if (window.flowerShop && window.flowerShop.showNotification) {
            window.flowerShop.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
