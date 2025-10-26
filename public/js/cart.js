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

        console.log('🛒 Менеджер корзины инициализируется...');
        this.loadCart();
        this.bindCartEvents();
        
        this.isInitialized = true;
        console.log('🛒 Менеджер корзины успешно инициализирован');
    }

    // ... остальные методы класса ...

    addToCart(productData, quantity = 1) {
        if (!productData.id || !productData.name || !productData.price) {
            console.error('Неверные данные товара:', productData);
            this.showNotification('Ошибка добавления товара в корзину', 'error');
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
        this.showNotification(`${product.name} добавлен в корзину!`, 'success');

        return true;
    }

    updateQuantity(button) {
        const itemId = parseInt(button.dataset.itemId);
        const change = parseInt(button.dataset.change);
        
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            this.showNotification('Количество не может быть меньше 1', 'warning');
            return;
        }

        if (newQuantity > 50) {
            this.showNotification('Максимальное количество - 50', 'warning');
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
            this.showNotification('Количество не может быть меньше 1', 'warning');
            input.value = 1;
            return;
        }

        if (newQuantity > 50) {
            this.showNotification('Максимальное количество - 50', 'warning');
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

        if (!confirm(`Вы уверены, что хотите удалить "${item.name}" из корзины?`)) {
            return;
        }

        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Товар удален из корзины', 'success');
    }

    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('Ваша корзина уже пуста', 'info');
            return;
        }

        if (!confirm('Вы уверены, что хотите очистить всю корзину?')) {
            return;
        }

        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Корзина очищена успешно', 'success');
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Ваша корзина пуста', 'warning');
            return;
        }

        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showNotification('Пожалуйста, войдите, чтобы продолжить оформление заказа', 'warning');
            setTimeout(() => {
                window.location.href = '/login?returnUrl=/cart';
            }, 1500);
            return;
        }

        // Simulate checkout process
        this.showNotification('Переход к оформлению заказа...', 'info');
        
        // In a real app, you would redirect to checkout page
        setTimeout(() => {
            this.showNotification('Функция оформления заказа скоро будет доступна!', 'success');
        }, 2000);
    }

    // ... остальные методы класса ...

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
                    <p class="item-price">${item.price.toFixed(2)} ₽ за шт.</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.id}" data-change="-1">-</button>
                        <input type="number" class="item-quantity" data-item-id="${item.id}" value="${item.quantity}" min="1" max="50">
                        <button class="btn btn-outline update-quantity" data-item-id="${item.id}" data-change="1">+</button>
                    </div>
                    <div class="item-total">
                        ${(item.price * item.quantity).toFixed(2)} ₽
                    </div>
                    <button class="btn btn-danger remove-item" data-item-id="${item.id}">Удалить</button>
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
        const deliveryFee = subtotal > 5000 ? 0 : 500; // Бесплатная доставка от 5000 ₽
        const tax = subtotal * 0.20; // 20% налог
        const total = subtotal + deliveryFee + tax;

        if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} ₽`;
        if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee === 0 ? 'БЕСПЛАТНО' : `${deliveryFee.toFixed(2)} ₽`;
        if (taxElement) taxElement.textContent = `${tax.toFixed(2)} ₽`;
        if (totalElement) totalElement.textContent = `${total.toFixed(2)} ₽`;
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
