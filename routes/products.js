const express = require('express');
const db = require('../config/database');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get all products with optional filtering
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, inStock, difficulty } = req.query;

        // Получаем все продукты с категориями
        const [products] = await db.query(`
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_available = true
        `);

        // Фильтрация
        let filteredProducts = [...products];

        // Фильтр по категории (по slug или названию)
        if (category) {
            filteredProducts = filteredProducts.filter(p =>
                (p.category_slug && p.category_slug.toLowerCase() === category.toLowerCase()) ||
                (p.category_name && p.category_name.toLowerCase() === category.toLowerCase())
            );
        }

        // Фильтр по уровню сложности
        if (difficulty) {
            let categoryIds = [];
            if (difficulty === 'beginner') categoryIds = [1];
            else if (difficulty === 'expert') categoryIds = [2];
            else if (difficulty === 'hard') categoryIds = [3];

            if (categoryIds.length > 0) {
                filteredProducts = filteredProducts.filter(p =>
                    categoryIds.includes(p.category_id)
                );
            }
        }

        // Поиск по названию или описанию
        if (search) {
            const searchLower = search.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                (p.description && p.description.toLowerCase().includes(searchLower))
            );
        }

        // Фильтр по минимальной цене
        if (minPrice) {
            filteredProducts = filteredProducts.filter(p =>
                p.price >= parseFloat(minPrice)
            );
        }

        // Фильтр по максимальной цене
        if (maxPrice) {
            filteredProducts = filteredProducts.filter(p =>
                p.price <= parseFloat(maxPrice)
            );
        }

        // Фильтр по наличию
        if (inStock === 'true') {
            filteredProducts = filteredProducts.filter(p =>
                p.stock_quantity > 0
            );
        }

        res.json({
            success: true,
            data: filteredProducts,
            count: filteredProducts.length
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = ? AND p.is_available = true`,
            [req.params.id]
        );

        const product = products[0];

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

// Create product (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { name, description, price, category_id, image_url, stock_quantity } = req.body;

        if (!name || !price || !category_id) {
            return res.status(400).json({
                success: false,
                error: 'Name, price and category are required'
            });
        }

        // В мок-режиме просто возвращаем успех
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                id: Date.now(),
                name,
                description,
                price: parseFloat(price),
                category_id: parseInt(category_id),
                image_url,
                stock_quantity: parseInt(stock_quantity) || 0,
                is_available: true,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
});

// Update product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});

// Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});

// Get categories
router.get('/categories/all', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

module.exports = router;