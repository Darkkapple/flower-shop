const express = require('express');
const db = require('../config/database');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get all products with optional filtering
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, inStock } = req.query;

        let query = `
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_available = true
        `;
        let params = [];

        if (category) {
            query += ' AND c.name = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (minPrice) {
            query += ' AND p.price >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND p.price <= ?';
            params.push(parseFloat(maxPrice));
        }

        if (inStock === 'true') {
            query += ' AND p.stock_quantity > 0';
        }

        query += ' ORDER BY p.created_at DESC';

        const [products] = await db.execute(query, params);

        res.json({
            success: true,
            data: products,
            count: products.length
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
        const [products] = await db.execute(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = ? AND p.is_available = true`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: products[0]
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

        const [result] = await db.execute(
            `INSERT INTO products
             (name, description, price, category_id, image_url, stock_quantity)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, parseFloat(price), category_id, image_url, stock_quantity || 0]
        );

        const [newProduct] = await db.execute(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct[0]
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
        const { name, description, price, category_id, image_url, stock_quantity, is_available } = req.body;

        const [result] = await db.execute(
            `UPDATE products
             SET name = ?, description = ?, price = ?, category_id = ?,
                 image_url = ?, stock_quantity = ?, is_available = ?
             WHERE id = ?`,
            [name, description, price, category_id, image_url, stock_quantity, is_available, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

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
        const [result] = await db.execute(
            'DELETE FROM products WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

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
        const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');

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