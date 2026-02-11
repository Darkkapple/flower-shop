const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isAdmin = user.is_admin;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            'INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, false]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.session.userId) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                isAdmin: req.session.isAdmin
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;