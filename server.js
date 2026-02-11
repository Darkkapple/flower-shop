const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'flower-shop-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes - все маршруты используют мок-данные из database.js
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'catalog.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'cart.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'register.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'admin.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'contact.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'product.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Цветочного Магазина работает',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Цветочный Магазин запущен на порту ${PORT}`);
    console.log(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Режим: Мок-данные (без реальной БД)`);
});