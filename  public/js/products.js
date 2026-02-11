class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            difficulty: ''
        };
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.bindEvents();
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.debouncedSearch();
            });
        }

        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.filters.difficulty = '';
                document.querySelectorAll('.difficulty-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                const allBtn = document.querySelector('.difficulty-filter-btn[data-level=""]');
                if (allBtn) allBtn.classList.add('active');
                this.loadProducts();
            });
        }

        document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.level;

                document.querySelectorAll('.difficulty-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');

                this.filters.difficulty = difficulty;
                this.filters.category = '';

                const categoryFilter = document.getElementById('category-filter');
                if (categoryFilter) categoryFilter.value = '';

                this.loadProducts();
            });
        });

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

        const inStockFilter = document.getElementById('in-stock-filter');
        if (inStockFilter) {
            inStockFilter.addEventListener('change', (e) => {
                this.filters.inStock = e.target.checked;
                this.loadProducts();
            });
        }

        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-product')) {
                this.editProduct(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-product')) {
                this.deleteProduct(e.target.dataset.id);
            } else if (e.target.id === 'add-product-btn') {
                this.showAddProductForm();
            }
        });

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
            if (this.filters.difficulty) queryParams.append('difficulty', this.filters.difficulty);
            if (this.filters.minPrice) queryParams.append('minPrice', this.filters.minPrice);
            if (this.filters.maxPrice) queryParams.append('maxPrice', this.filters.maxPrice);
            if (this.filters.inStock) queryParams.append('inStock', 'true');

            const response = await fetch(`/api/products?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                this.products = data.data;
                this.renderProducts();
                this.updateProductCount();
            } else {
                console.error('Failed to load products:', data.error);
                this.showNotification('Ошибка загрузки товаров', 'error');
            }
        } catch (error) {
            console.error('Load products error:', error);
            this.showNotification('Ошибка загрузки товаров', 'error');
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
                <h3>🌿 Товары не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }

    container.innerHTML = this.products.map(product => {
        let difficultyClass = '';
        let difficultyName = '🌿 Обычный';

        if (product.category_id === 1) {
            difficultyClass = 'beginner';
            difficultyName = '🌱 Для начинающих';
        } else if (product.category_id === 2) {
            difficultyClass = 'expert';
            difficultyName = '🌟 Для опытных';
        } else if (product.category_id === 3) {
            difficultyClass = 'hard';
            difficultyName = '⚠️ Капризные';
        }

        return `
            <div class="product-card ${difficultyClass}">
                <div class="product-image-wrapper">
                    <div class="product-image" style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 2rem;">
                        🌸
                    </div>
                    <span class="difficulty-badge ${difficultyClass}">${difficultyName}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || 'Красивое комнатное растение'}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category_name || 'Комнатное растение'}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price} ₽</span>
                        <button class="btn btn-primary add-to-cart"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}">
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

    renderAdminProductsTable(container) {
        if (this.products.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">Товары не найдены</td>
                </tr>
            `;
            return;
        }

        container.innerHTML = this.products.map(product => {
            let difficultyClass = '';
            let difficultyName = '🌿 Обычный';

            if (product.category_id === 1) {
                difficultyClass = 'beginner';
                difficultyName = '🌱 Для начинающих';
            } else if (product.category_id === 2) {
                difficultyClass = 'expert';
                difficultyName = '🌟 Для опытных';
            } else if (product.category_id === 3) {
                difficultyClass = 'hard';
                difficultyName = '⚠️ Капризные';
            }

            return `
                <tr>
                    <td>${product.id}</td>
                    <td>
                        <img src="${product.image_url && product.image_url !== '/images/' ? product.image_url : '/images/placeholder.jpg'}"
                             alt="${product.name}"
                             class="product-thumbnail"
                             onerror="this.src='/images/placeholder.jpg'">
                    </td>
                    <td>${this.escapeHtml(product.name)}</td>
                    <td>${product.category_name || '—'}</td>
                    <td>${product.price} ₽</td>
                    <td>
                        <span class="difficulty-badge-small ${difficultyClass}">
                            ${difficultyName}
                        </span>
                    </td>
                    <td>${product.stock_quantity}</td>
                    <td>
                        <span class="badge ${product.is_available ? 'badge-success' : 'badge-danger'}">
                            ${product.is_available ? 'Активен' : 'Неактивен'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline edit-product" data-id="${product.id}">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderCategoryFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const categorySelect = document.getElementById('product-category');

        if (categoryFilter) {
            categoryFilter.innerHTML = `
                <option value="">Все категории</option>
                ${this.categories.map(cat => `
                    <option value="${cat.slug || cat.name}">${cat.name}</option>
                `).join('')}
            `;
        }

        if (categorySelect) {
            categorySelect.innerHTML = this.categories.map(cat => `
                <option value="${cat.id}">${cat.name}</option>
            `).join('');
        }
    }

    updateProductCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = `Найдено: ${this.products.length} товаров`;
        }
    }

    clearFilters() {
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            difficulty: ''
        };

        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const minPriceFilter = document.getElementById('min-price-filter');
        const maxPriceFilter = document.getElementById('max-price-filter');
        const inStockFilter = document.getElementById('in-stock-filter');

        document.querySelectorAll('.difficulty-filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        const allBtn = document.querySelector('.difficulty-filter-btn[data-level=""]');
        if (allBtn) allBtn.classList.add('active');

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
                this.showNotification('Не удалось загрузить товар', 'error');
            }
        } catch (error) {
            console.error('Edit product error:', error);
            this.showNotification('Ошибка загрузки товара', 'error');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Товар успешно удален', 'success');
                this.loadProducts();
            } else {
                this.showNotification(data.error || 'Ошибка удаления', 'error');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            this.showNotification('Ошибка удаления товара', 'error');
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
            formTitle.textContent = product ? 'Редактировать товар' : 'Добавить товар';
        }

        if (productId) {
            productId.value = product ? product.id : '';
        }

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

        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.style.display = 'block';
        }
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
                    `Товар успешно ${isEdit ? 'обновлен' : 'создан'}`,
                    'success'
                );

                const modal = document.getElementById('product-modal');
                if (modal) {
                    modal.style.display = 'none';
                }

                this.loadProducts();
            } else {
                this.showNotification(data.error || 'Ошибка сохранения', 'error');
            }
        } catch (error) {
            console.error('Save product error:', error);
            this.showNotification('Ошибка сохранения товара', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
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

document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});