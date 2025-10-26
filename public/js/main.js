/**
 * Main JavaScript file for Flower Shop
 * Handles general functionality and coordination between modules
 */

class FlowerShopApp {
    constructor() {
        this.isInitialized = false;
        this.currentPage = this.getCurrentPage();
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        console.log('🌸 Flowershop инициализируется...');

        this.bindGlobalEvents();
        this.initializeModules();
        this.setupErrorHandling();

        this.isInitialized = true;
        console.log('🌸 Flowershop успешно инициализирован');
    }

    // ... остальные методы класса остаются без изменений ...

    async loadFeaturedProducts() {
        try {
            console.log('Загрузка популярных товаров...');
            const response = await fetch('/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                this.displayFeaturedProducts(data.data.slice(0, 4));
            } else {
                throw new Error(data.error || 'Не удалось загрузить товары');
            }
        } catch (error) {
            console.error('Ошибка загрузки популярных товаров:', error);
            this.showNotification('Не удалось загрузить товары. Пожалуйста, попробуйте еще раз.', 'error');
            this.displayFallbackProducts();
        }
    }

    displayFeaturedProducts(products) {
        const grid = document.getElementById('featured-products-grid');
        if (!grid) {
            console.log('Сетка популярных товаров не найдена');
            return;
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <div class="loading-spinner"></div>
                    <p>Загрузка товаров...</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image_url ?
                        `<img src="${product.image_url}" alt="${product.name}" onerror="this.style.display='none'">` :
                        '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:white;">🌸 Цветок</div>'
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                    <p class="product-description">${this.escapeHtml(product.description)}</p>
                    <div class="product-meta">
                        <span class="product-category">${this.escapeHtml(product.category_name)}</span>
                        <span class="product-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock_quantity > 0 ? 'В наличии' : 'Нет в наличии'}
                        </span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price} ₽</span>
                        <button class="btn btn-primary add-to-cart"
                                data-id="${product.id}"
                                data-name="${this.escapeHtml(product.name)}"
                                data-price="${product.price}"
                                ${product.stock_quantity === 0 ? 'disabled' : ''}>
                            ${product.stock_quantity === 0 ? 'Нет в наличии' : 'В корзину'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(`Отображено ${products.length} популярных товаров`);
    }

    displayFallbackProducts() {
        const grid = document.getElementById('featured-products-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">🌸 Розы</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">Красивые розы</h3>
                    <p class="product-description">Великолепные композиции из роз для любого случая</p>
                    <div class="product-meta">
                        <span class="product-category">Розы</span>
                        <span class="product-stock in-stock">В наличии</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">2499 ₽</span>
                        <button class="btn btn-primary add-to-cart">В корзину</button>
                    </div>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;">🌷 Тюльпаны</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">Яркие тюльпаны</h3>
                    <p class="product-description">Свежие тюльпаны, чтобы скрасить ваш день</p>
                    <div class="product-meta">
                        <span class="product-category">Тюльпаны</span>
                        <span class="product-stock in-stock">В наличии</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">1999 ₽</span>
                        <button class="btn btn-primary add-to-cart">В корзину</button>
                    </div>
                </div>
            </div>
        `;
    }

    addToCart(productData) {
        if (!productData.id || !productData.name || !productData.price) {
            console.error('Неверные данные товара:', productData);
            this.showNotification('Ошибка добавления товара в корзину', 'error');
            return;
        }

        const product = {
            id: parseInt(productData.id),
            name: productData.name,
            price: parseFloat(productData.price),
            quantity: 1,
            image: productData.image || '/images/placeholder.jpg'
        };

        // Check if product already in cart
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} добавлен в корзину!`, 'success');

        // Add visual feedback
        const button = document.querySelector(`[data-id="${product.id}"]`);
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '✓ Добавлено!';
            button.style.background = 'var(--accent-color)';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }
    }

    // ... остальные методы класса ...

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (element.parentElement) {
                element.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });

        console.log(`Корзина обновлена: ${totalItems} товаров`);
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Глобальная ошибка:', e.error);
            this.showNotification('Что-то пошло не так. Пожалуйста, обновите страницу.', 'error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанное обещание:', e.reason);
            this.showNotification('Что-то пошло не так. Пожалуйста, попробуйте еще раз.', 'error');
            e.preventDefault();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for animations
    if (!document.querySelector('#dynamic-styles')) {
        const styles = document.createElement('style');
        styles.id = 'dynamic-styles';
        styles.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    window.flowerShop = new FlowerShopApp();
});