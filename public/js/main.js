class FlowerShopApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🌸 Flower Shop initialized');
        this.loadFeaturedProducts();
        this.updateCartCount();
    }

    async loadFeaturedProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success) {
                this.displayFeaturedProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    displayFeaturedProducts(products) {
        const grid = document.getElementById('featured-products-grid');
        if (!grid) return;

        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_url || '/images/placeholder.jpg'}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsb3dlciBJbWFnZTwvdGV4dD48L3N2Zz4='">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category_name}</span>
                        <span class="product-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <button class="btn btn-primary add-to-cart" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                ${product.stock_quantity === 0 ? 'disabled' : ''}>
                            ${product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                this.addToCart(e.target.dataset);
            });
        });
    }

    addToCart(productData) {
        alert(`Added ${productData.name} to cart!`);
        this.updateCartCount(1);
    }

    updateCartCount(increment = 0) {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            currentCount += increment;
            cartCount.textContent = currentCount;
            cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.flowerShop = new FlowerShopApp();
});
