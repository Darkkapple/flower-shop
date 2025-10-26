const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Get cart items
router.get('/', requireAuth, async (req, res) => {
    try {
        // In a real app, you might store cart in database
        // For now, we'll use session storage for demo
        const cart = req.session.cart || [];

        // If we have product IDs in cart, get product details
        if (cart.length > 0) {
            const productIds = cart.map(item => item.productId);
            const placeholders = productIds.map(() => '?').join(',');

            const [products] = await db.execute(
                `SELECT id, name, price, image_url, stock_quantity
                 FROM products
                 WHERE id IN (${placeholders}) AND is_available = true`,
                productIds
            );

            const cartWithDetails = cart.map(item => {
                const product = products.find(p => p.id === item.productId);
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

        // Verify product exists and is available
        const [products] = await db.execute(
            'SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_available = true',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        const product = products[0];

        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock'
            });
        }

        // Initialize cart if not exists
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if product already in cart
        const existingItemIndex = req.session.cart.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = req.session.cart[existingItemIndex].quantity + quantity;

            if (newQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot add more than available stock'
                });
            }

            req.session.cart[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            req.session.cart.push({
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: 'Product added to cart',
            data: {
                cartItemCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
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
            // Remove item if quantity is 0
            req.session.cart = req.session.cart.filter(item => item.productId !== parseInt(productId));
        } else {
            // Check stock
            const [products] = await db.execute(
                'SELECT stock_quantity FROM products WHERE id = ?',
                [productId]
            );

            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (quantity > products[0].stock_quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Insufficient stock'
                });
            }

            // Update quantity
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