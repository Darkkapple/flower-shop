const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Get cart items
router.get('/', requireAuth, async (req, res) => {
    try {
        const cart = req.session.cart || [];

        if (cart.length > 0) {
            // Получаем все продукты
            const [allProducts] = await db.query(`
                SELECT id, name, price, image_url, stock_quantity
                FROM products
                WHERE is_available = true
            `);

            const cartWithDetails = cart.map(item => {
                const product = allProducts.find(p => p.id === item.productId);
                return {
                    ...item,
                    product: product || null,
                    total: product ? product.price * item.quantity : 0
                };
            }).filter(item => item.product !== null);

            const total = cartWithDetails.reduce((sum, item) => sum + item.total, 0);
            const totalItems = cartWithDetails.reduce((sum, item) => sum + item.quantity, 0);

            res.json({
                success: true,
                data: {
                    items: cartWithDetails,
                    summary: {
                        totalItems,
                        totalAmount: total,
                        itemCount: cartWithDetails.length
                    }
                }
            });
        } else {
            res.json({
                success: true,
                data: {
                    items: [],
                    summary: {
                        totalItems: 0,
                        totalAmount: 0,
                        itemCount: 0
                    }
                }
            });
        }
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart'
        });
    }
});

// Add item to cart
router.post('/add', requireAuth, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        // Получаем продукт
        const [products] = await db.query(
            'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_available = true',
            [productId]
        );

        const product = products[0];

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock'
            });
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItemIndex = req.session.cart.findIndex(item => item.productId === parseInt(productId));

        if (existingItemIndex > -1) {
            const newQuantity = req.session.cart[existingItemIndex].quantity + quantity;

            if (newQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot add more than available stock'
                });
            }

            req.session.cart[existingItemIndex].quantity = newQuantity;
        } else {
            req.session.cart.push({
                productId: parseInt(productId),
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        const cartItemCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            success: true,
            message: 'Product added to cart',
            data: {
                cartItemCount
            }
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item to cart'
        });
    }
});

// Update cart item quantity
router.put('/update/:productId', requireAuth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid quantity is required'
            });
        }

        if (quantity === 0) {
            req.session.cart = req.session.cart.filter(item => item.productId !== parseInt(productId));
        } else {
            const [products] = await db.query(
                'SELECT stock_quantity FROM products WHERE id = ?',
                [productId]
            );

            const product = products[0];

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (quantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient stock'
                });
            }

            const itemIndex = req.session.cart.findIndex(item => item.productId === parseInt(productId));

            if (itemIndex > -1) {
                req.session.cart[itemIndex].quantity = quantity;
            } else {
                return res.status(404).json({
                    success: false,
                    error: 'Item not found in cart'
                });
            }
        }

        res.json({
            success: true,
            message: 'Cart updated successfully'
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart'
        });
    }
});

// Remove item from cart
router.delete('/remove/:productId', requireAuth, async (req, res) => {
    try {
        const { productId } = req.params;

        if (!req.session.cart) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        req.session.cart = req.session.cart.filter(item => item.productId !== parseInt(productId));

        res.json({
            success: true,
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove item from cart'
        });
    }
});

// Clear cart
router.delete('/clear', requireAuth, async (req, res) => {
    try {
        req.session.cart = [];

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart'
        });
    }
});

module.exports = router;