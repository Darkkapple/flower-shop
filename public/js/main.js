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

    initializeModules() {
        // Initialize based on current page
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'catalog':
                this.initCatalogPage();
                break;
            case 'cart':
                this.initCartPage();
                break;
            case 'login':
            case 'register':
                this.initAuthPage();
                break;
            default:
                this.initCommonFeatures();
        }

        // Always initialize common features
        this.initCommonFeatures();
    }

    initCommonFeatures() {
        this.updateCartCount();
        this.setupNotifications();
        this.setupLoadingStates();
    }

    initHomePage() {
        console.log('Initializing home page...');
        this.loadFeaturedProducts();
        this.setupHeroAnimations();
    }

    initCatalogPage() {
        console.log('Initializing catalog page...');
        // Catalog functionality will be handled by ProductManager
    }

    initCartPage() {
        console.log('Initializing cart page...');
        // Cart functionality will be handled by CartManager
    }

    initAuthPage() {
        console.log('Initializing auth page...');
        // Auth functionality will be handled by AuthManager
    }

    bindGlobalEvents() {
        // Global click handler for dynamic content
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                this.addToCart(button.dataset);
            }
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline', 'warning');
        });
    }

    handleGlobalClick(e) {
        const target = e.target;

        // Handle back to top button
        if (target.classList.contains('back-to-top')) {
            this.scrollToTop();
        }
    }

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

    loadCart() {
        try {
            const savedCart = localStorage.getItem('flowerShopCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('flowerShopCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

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

    setupHeroAnimations() {
        // Simple fade-in animation for hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-actions');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';

            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupNotifications() {
        // Create notifications container if it doesn't exist
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const typeStyles = {
            success: { background: '#d4edda', color: '#155724', borderColor: '#28a745' },
            error: { background: '#f8d7da', color: '#721c24', borderColor: '#dc3545' },
            warning: { background: '#fff3cd', color: '#856404', borderColor: '#ffc107' },
            info: { background: '#d1ecf1', color: '#0c5460', borderColor: '#17a2b8' }
        };

        const style = typeStyles[type] || typeStyles.info;

        notification.style.cssText = `
            background: ${style.background};
            color: ${style.color};
            border-left: 4px solid ${style.borderColor};
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            margin-bottom: 0.5rem;
            animation: slideInRight 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
        `;

        notification.innerHTML = `
            <span>${this.escapeHtml(message)}</span>
            <button class="notification-close" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:inherit;margin-left:1rem;">&times;</button>
        `;

        container.appendChild(notification);

        // Auto remove after duration
        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        });

        return notification;
    }

    setupLoadingStates() {
        // Add loading state to buttons when forms are submitted
        document.addEventListener('submit', (e) => {
            const submitButton = e.target.querySelector('button[type="submit"]');
            if (submitButton) {
                this.setButtonLoading(submitButton, true);

                // Reset after form processing (you might want to do this in your form handlers)
                setTimeout(() => {
                    this.setButtonLoading(submitButton, false);
                }, 3000);
            }
        });
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.setAttribute('data-original-text', button.innerHTML);
            button.innerHTML = `
                <div class="btn-spinner" style="width:16px;height:16px;border:2px solid transparent;border-top:2px solid currentColor;border-radius:50%;animation:spin 1s linear infinite;margin-right:8px;"></div>
                Loading...
            `;
        } else {
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.innerHTML = originalText;
            }
        }
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

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/') return 'home';
        if (path.includes('/catalog')) return 'catalog';
        if (path.includes('/cart')) return 'cart';
        if (path.includes('/login')) return 'login';
        if (path.includes('/register')) return 'register';
        if (path.includes('/admin')) return 'admin';
        return 'other';
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Utility method to check if API is available
    async checkAPIHealth() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            return data.status === 'OK';
        } catch (error) {
            console.error('API health check failed:', error);
            return false;
        }
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