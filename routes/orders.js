const express = require('express');
const db = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', requireAuth, async (req, res) => {
    try {
        const {
            items,
            customer_name,
            customer_email,
            customer_phone,
            delivery_address
        } = req.body;

        if (!items || !items.length || !customer_name || !customer_email || !delivery_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Получаем все продукты
        const [allProducts] = await db.query('SELECT * FROM products WHERE is_available = true');

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = allProducts.find(p => p.id === item.product_id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: `Product ${item.product_id} not found`
                });
            }

            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for product ${product.name}`
                });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity: item.quantity,
                unit_price: product.price,
                image_url: product.image_url
            });
        }

        // Создаем заказ в мок-БД
        const [orderResult] = await db.execute(
            `INSERT INTO orders
             (user_id, total_amount, customer_name, customer_email, customer_phone, delivery_address)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.session.userId, totalAmount, customer_name, customer_email, customer_phone, delivery_address]
        );

        const orderId = orderResult.insertId;

        // Создаем позиции заказа
        for (const item of items) {
            await db.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.unit_price || 0]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId,
                totalAmount,
                items: orderItems
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create order'
        });
    }
});

// Get user's orders
router.get('/my-orders', requireAuth, async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.userId]
        );

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// Get order details
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.session.userId]
        );

        const order = orders[0];

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Получаем позиции заказа
        const [items] = await db.query(
            `SELECT oi.*, p.name as product_name, p.image_url
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [req.params.id]
        );

        res.json({
            success: true,
            data: {
                ...order,
                items
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
});

// Get all orders (admin only)
router.get('/', requireAdmin, async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.username
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// Update order status (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Valid status is required'
            });
        }

        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
});

module.exports = router;