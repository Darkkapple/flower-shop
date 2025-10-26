/**
 * Main JavaScript file for Flower Shop
 * Handles general functionality, UI interactions, and coordination between modules
 */

class FlowerShopApp {
    constructor() {
        this.isInitialized = false;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.bindGlobalEvents();
        this.initializeModules();
        this.setupServiceWorker();
        this.setupErrorHandling();

        this.isInitialized = true;
        console.log('🌸 Flower Shop App initialized');
    }

    initializeModules() {
        // Initialize modules based on current page
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
            case 'admin':
                this.initAdminPage();
                break;
            default:
                this.initCommonFeatures();
        }

        // Always initialize common features
        this.initCommonFeatures();
    }

    initCommonFeatures() {
        this.setupMobileMenu();
        this.setupSearch();
        this.setupNotifications();
        this.setupLoadingStates();
        this.setupAccessibility();
    }

    initHomePage() {
        // Homepage specific initialization
        this.setupHeroSlider();
        this.setupFeaturedProducts();
        this.setupNewsletterSignup();
    }

    initCatalogPage() {
        // Catalog page will be handled by ProductManager
        console.log('Catalog page initialized');
    }

    initCartPage() {
        // Cart page will be handled by CartManager
        console.log('Cart page initialized');
    }

    initAuthPage() {
        // Auth page will be handled by AuthManager
        console.log('Auth page initialized');
    }

    initAdminPage() {
        // Admin page specific features
        if (window.authManager && window.authManager.isAdmin()) {
            this.setupAdminFeatures();
        } else {
            this.redirectToLogin();
        }
    }

    bindGlobalEvents() {
        // Global click handler for dynamic content
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Global form submission handler
        document.addEventListener('submit', (e) => {
            this.handleGlobalSubmit(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline', 'error');
        });

        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.onPageVisible();
            }
        });
    }

    handleGlobalClick(e) {
        const target = e.target;

        // Handle external links
        if (target.tagName === 'A' && target.href && this.isExternalLink(target.href)) {
            this.handleExternalLink(target, e);
        }

        // Handle back to top button
        if (target.classList.contains('back-to-top')) {
            this.scrollToTop();
        }

        // Handle modal close buttons
        if (target.classList.contains('modal-close') || target.closest('.modal-close')) {
            this.closeModal(target);
        }

        // Handle dropdown toggles
        if (target.classList.contains('dropdown-toggle')) {
            this.toggleDropdown(target);
        }
    }

    handleGlobalSubmit(e) {
        const form = e.target;

        // Add loading state to submit buttons
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            this.setButtonLoading(submitButton, true);
        }

        // Handle form validation
        if (!form.checkValidity()) {
            e.preventDefault();
            this.showFormErrors(form);
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.focusSearchInput();
        }

        // Escape key to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // Close mobile menu when clicking on links
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    setupSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('global-search-input');
        const searchResults = document.getElementById('search-results');

        // Open search overlay
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });

        // Close search overlay
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearch();
                }
            });

            // Search input handling
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.performSearch(e.target.value);
                    }, 300);
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeSearch();
                    }
                });
            }
        }
    }

    async performSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        try {
            const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();

            if (data.success) {
                this.displaySearchResults(data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }

    displaySearchResults(products) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (products.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No products found for your search.</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = products.map(product => `
            <div class="search-result-item" data-product-id="${product.id}">
                <img src="${product.image_url || '/images/placeholder.jpg'}"
                     alt="${product.name}"
                     class="search-result-image">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p class="search-result-price">$${product.price}</p>
                    <span class="search-result-category">${product.category_name}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers to search results
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                window.location.href = `/product.html?id=${productId}`;
            });
        });
    }

    clearSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    openSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('global-search-input');

        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    closeSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('global-search-input');

        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';

            if (searchInput) {
                searchInput.value = '';
            }

            this.clearSearchResults();
        }
    }

    focusSearchInput() {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.focus();
        } else {
            this.openSearch();
        }
    }

    setupNotifications() {
        // Notification container will be created dynamically
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add styles if not already in CSS
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notifications-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                }
                .notification {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    margin-bottom: 10px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success {
                    border-left: 4px solid #28a745;
                }
                .notification-error {
                    border-left: 4px solid #dc3545;
                }
                .notification-info {
                    border-left: 4px solid #17a2b8;
                }
                .notification-content {
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        container.appendChild(notification);

        // Auto remove after duration
        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.remove();
        });

        return notification;
    }

    setupLoadingStates() {
        // Intercept fetch requests to show loading states
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            // Show loading indicator
            this.showLoading();

            try {
                const response = await originalFetch(...args);
                return response;
            } finally {
                this.hideLoading();
            }
        };
    }

    showLoading() {
        // Create or show loading indicator
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'global-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading...</div>
            `;
            document.body.appendChild(loader);

            // Add loader styles
            const styles = document.createElement('style');
            styles.textContent = `
                .global-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .loader-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4a90e2;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                .loader-text {
                    margin-top: 16px;
                    color: #333;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }

        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    setupAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Handle focus trapping in modals
        this.setupFocusTrap();

        // Add ARIA labels to dynamic content
        this.enhanceAccessibility();
    }

    setupFocusTrap() {
        // Focus trap for modals would be implemented here
        // This is a simplified version
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.querySelector('.modal.active')) {
                this.trapFocus(e);
            }
        });
    }

    trapFocus(e) {
        // Simplified focus trap implementation
        const modal = document.querySelector('.modal.active');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    enhanceAccessibility() {
        // Add ARIA labels to dynamic content
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.setAttribute('aria-label', `${cartCount.textContent} items in cart`);
        }

        // Update live regions for dynamic content
        this.setupLiveRegions();
    }

    setupLiveRegions() {
        // Create live region for announcements
        if (!document.getElementById('a11y-announcements')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('a11y-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;

            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showNotification('Something went wrong. Please try again.', 'error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showNotification('Something went wrong. Please try again.', 'error');
            e.preventDefault();
        });
    }

    setupHeroSlider() {
        // Simple hero slider implementation
        const heroSlides = document.querySelectorAll('.hero-slide');
        if (heroSlides.length > 1) {
            let currentSlide = 0;

            setInterval(() => {
                heroSlides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % heroSlides.length;
                heroSlides[currentSlide].classList.add('active');
            }, 5000);
        }
    }

    setupFeaturedProducts() {
        // Featured products are loaded in the HTML
        // Additional interactions can be added here
    }

    setupNewsletterSignup() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;

                try {
                    // Simulate newsletter signup
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.showNotification('Thank you for subscribing!', 'success');
                    newsletterForm.reset();
                } catch (error) {
                    this.showNotification('Subscription failed. Please try again.', 'error');
                }
            });
        }
    }

    setupAdminFeatures() {
        // Admin-specific features would be initialized here
        console.log('Admin features initialized');
    }

    // Utility methods
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

    isExternalLink(url) {
        return new URL(url, window.location.origin).origin !== window.location.origin;
    }

    handleExternalLink(link, event) {
        // Add confirmation for external links if needed
        // event.preventDefault();
        // window.open(link.href, '_blank');
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    closeModal(closeButton) {
        const modal = closeButton.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    toggleDropdown(button) {
        const dropdown = button.nextElementSibling;
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.setAttribute('data-original-text', button.textContent);
            button.innerHTML = '<span class="button-spinner"></span> Loading...';
        } else {
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
            }
        }
    }

    showFormErrors(form) {
        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(error => error.remove());
        form.querySelectorAll('.field-error').forEach(field => field.classList.remove('field-error'));

        // Show new errors
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(field => {
            field.classList.add('field-error');

            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = field.validationMessage;

            field.parentNode.appendChild(errorMessage);
        });

        this.showNotification('Please fix the errors in the form', 'error');
    }

    onPageVisible() {
        // Refresh data when page becomes visible again
        if (window.productManager) {
            window.productManager.loadProducts();
        }
        if (window.cartManager) {
            window.cartManager.loadCart();
        }
    }

    redirectToLogin() {
        window.location.href = '/login?returnUrl=' + encodeURIComponent(window.location.pathname);
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const navigationTiming = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', navigationTiming.loadEventEnd - navigationTiming.navigationStart);
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flowerShopApp = new FlowerShopApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowerShopApp;
}