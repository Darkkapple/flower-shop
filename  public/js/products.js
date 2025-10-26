class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false
        };
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.bindEvents();
        this.renderProducts();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.debouncedSearch();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.loadProducts();
            });
        }

        // Price filters
        const minPriceFilter = document.getElementById('min-price-filter');
        const maxPriceFilter = document.getElementById('max-price-filter');

        if (minPriceFilter) {
            minPriceFilter.addEventListener('change', (e) => {
                this.filters.minPrice = e.target.value;
                this.loadProducts();
            });
        }

        if (maxPriceFilter) {
            maxPriceFilter.addEventListener('change', (e) => {
                this.filters.maxPrice = e.target.value;
                this.loadProducts();
            });
        }

        // Stock filter
        const inStockFilter = document.getElementById('in-stock-filter');
        if (inStockFilter) {
            inStockFilter.addEventListener('change', (e) => {
                this.filters.inStock = e.target.checked;
                this.loadProducts();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Admin product management
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-product')) {
                this.editProduct(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-product')) {
                this.deleteProduct(e.target.dataset.id);
            } else if (e.target.id === 'add-product-btn') {
                this.showAddProductForm();
            }
        });

        // Product form submission
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductFormSubmit(e));
        }
    }

    debouncedSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.loadProducts();
        }, 500);
    }

    async loadProducts() {
        try {
            const queryParams = new URLSearchParams();

            if (this.filters.search) queryParams.append('search', this.filters.search);
            if (this.filters.category) queryParams.append('category', this.filters.category);
            if (this.filters.minPrice) queryParams.append('minPrice', this.filters.minPrice);
            if (this.filters.maxPrice) queryParams.append('maxPrice', this.filters.maxPrice);
            if (this.filters.inStock) queryParams.append('inStock', 'true');

            const response = await fetch(`/api/products?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                this.products = data.data;
                this.renderProducts();
            } else {
                console.error('Failed to load products:', data.error);
            }
        } catch (error) {
            console.error('Load products error:', error);
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/products/categories/all');
            const data = await response.json();

            if (data.success) {
                this.categories = data.data;
                this.renderCategoryFilters();
            }
        } catch (error) {
            console.error('Load categories error:', error);
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        const adminProductsTable = document.getElementById('admin-products-table');

        if (productsGrid) {
            this.renderProductsGrid(productsGrid);
        }

        if (adminProductsTable) {
            this.renderAdminProductsTable(adminProductsTable);
        }
    }

    renderProductsGrid(container) {
        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image_url || '/images/placeholder.jpg'}"
                     alt="${product.name}"
                     class="product-image"
                     onerror="this.src='/images/placeholder.jpg'">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || 'No description available'}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category_name}</span>
                        <span class="product-stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
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
    }

    renderAdminProductsTable(container) {
        if (this.products.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No products found</td>
                </tr>
            `;
            return;
        }

        container.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.image_url || '/images/placeholder.jpg'}"
                         alt="${product.name}"
                         class="product-thumbnail"
                         onerror="this.src='/images/placeholder.jpg'">
                </td>
                <td>${product.name}</td>
                <td>${product.category_name}</td>
                <td>$${product.price}</td>
                <td>${product.stock_quantity}</td>
                <td>
                    <span class="badge ${product.is_available ? 'badge-success' : 'badge-danger'}">
                        ${product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline edit-product" data-id="${product.id}">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderCategoryFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const categorySelect = document.getElementById('product-category');

        if (categoryFilter) {
            categoryFilter.innerHTML = `
                <option value="">All Categories</option>
                ${this.categories.map(cat => `
                    <option value="${cat.name}">${cat.name}</option>
                `).join('')}
            `;
        }

        if (categorySelect) {
            categorySelect.innerHTML = this.categories.map(cat => `
                <option value="${cat.id}">${cat.name}</option>
            `).join('');
        }
    }

    clearFilters() {
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false
        };

        // Reset form elements
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const minPriceFilter = document.getElementById('min-price-filter');
        const maxPriceFilter = document.getElementById('max-price-filter');
        const inStockFilter = document.getElementById('in-stock-filter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (minPriceFilter) minPriceFilter.value = '';
        if (maxPriceFilter) maxPriceFilter.value = '';
        if (inStockFilter) inStockFilter.checked = false;

        this.loadProducts();
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const data = await response.json();

            if (data.success) {
                this.showProductForm(data.data);
            } else {
                this.showNotification('Failed to load product', 'error');
            }
        } catch (error) {
            console.error('Edit product error:', error);
            this.showNotification('Failed to load product', 'error');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Product deleted successfully', 'success');
                this.loadProducts();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            this.showNotification('Failed to delete product', 'error');
        }
    }

    showAddProductForm() {
        this.showProductForm();
    }

    showProductForm(product = null) {
        const form = document.getElementById('product-form');
        const formTitle = document.getElementById('product-form-title');
        const productId = document.getElementById('product-id');

        if (formTitle) {
            formTitle.textContent = product ? 'Edit Product' : 'Add New Product';
        }

        if (productId) {
            productId.value = product ? product.id : '';
        }

        // Fill form with product data if editing
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.category_id;
            document.getElementById('product-image').value = product.image_url || '';
            document.getElementById('product-stock').value = product.stock_quantity;
            document.getElementById('product-available').checked = product.is_available;
        } else {
            form.reset();
        }

        // Show modal (you would need a modal component)
        const modal = new bootstrap.Modal(document.getElementById('product-modal'));
        modal.show();
    }

    async handleProductFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category_id: parseInt(formData.get('category_id')),
            image_url: formData.get('image_url'),
            stock_quantity: parseInt(formData.get('stock_quantity')),
            is_available: formData.get('is_available') === 'on'
        };

        const productId = formData.get('id');
        const isEdit = !!productId;

        try {
            const url = isEdit ? `/api/products/${productId}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(
                    `Product ${isEdit ? 'updated' : 'created'} successfully`,
                    'success'
                );

                // Close modal and refresh products
                const modal = bootstrap.Modal.getInstance(document.getElementById('product-modal'));
                modal.hide();

                this.loadProducts();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Save product error:', error);
            this.showNotification('Failed to save product', 'error');
        }
    }

    showNotification(message, type = 'info') {
        if (window.authManager) {
            window.authManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});