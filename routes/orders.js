const express = require('express');
const db = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', requireAuth, async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            items,
            customer_name,
            customer_email,
            customer_phone,
            delivery_address
        } = req.body;

        // Validate required fields
        if (!items || !items.length || !customer_name || !customer_email || !delivery_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Calculate total and check stock
        let totalAmount = 0;
        for (const item of items) {
            const [products] = await connection.execute(
                'SELECT price, stock_quantity FROM products WHERE id = ? AND is_available = true',
                [item.product_id]
            );

            if (products.length === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            if (products[0].stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.product_id}`);
            }

            totalAmount += products[0].price * item.quantity;
        }

        // Create order
        const [orderResult] = await connection.execute(
            `INSERT INTO orders
             (user_id, total_amount, customer_name, customer_email, customer_phone, delivery_address)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.session.userId, totalAmount, customer_name, customer_email, customer_phone, delivery_address]
        );

        const orderId = orderResult.insertId;

        // Create order items and update stock
        for (const item of items) {
            const [products] = await connection.execute(
                'SELECT price FROM products WHERE id = ?',
                [item.product_id]
            );

            await connection.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, products[0].price]
            );

            await connection.execute(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        // Get complete order details
        const [orders] = await db.execute(
            `SELECT o.*,
                    oi.product_id, oi.quantity, oi.unit_price,
                    p.name as product_name, p.image_url
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE o.id = ?`,
            [orderId]
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId,
                totalAmount,
                items: orders.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    image_url: item.image_url
                }))
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create order'
        });
    } finally {
        connection.release();
    }
});

// Get user's orders
router.get('/my-orders', requireAuth, async (req, res) => {
    try {
        const [orders] = await db.execute(
            `SELECT o.*,
                    COUNT(oi.id) as item_count,
                    SUM(oi.quantity) as total_items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
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
        const [orders] = await db.execute(
            `SELECT o.*,
                    oi.product_id, oi.quantity, oi.unit_price,
                    p.name as product_name, p.image_url,
                    c.name as category_name
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE o.id = ? AND o.user_id = ?`,
            [req.params.id, req.session.userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const order = {
            id: orders[0].id,
            total_amount: orders[0].total_amount,
            status: orders[0].status,
            customer_name: orders[0].customer_name,
            customer_email: orders[0].customer_email,
            customer_phone: orders[0].customer_phone,
            delivery_address: orders[0].delivery_address,
            created_at: orders[0].created_at,
            items: orders.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                image_url: item.image_url,
                category_name: item.category_name
            }))
        };

        res.json({
            success: true,
            data: order
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
        const [orders] = await db.execute(
            `SELECT o.*, u.username,
                    COUNT(oi.id) as item_count,
                    SUM(oi.quantity) as total_items
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             GROUP BY o.id
             ORDER BY o.created_at DESC`
        );

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