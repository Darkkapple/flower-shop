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

// API Routes с русскими данными
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                name: "Букет красных роз",
                description: "12 красивых красных роз в элегантной композиции",
                price: 2499,
                category_name: "Розы",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 50,
                is_available: true
            },
            {
                id: 2,
                name: "Розовые тюльпаны",
                description: "Свежие розовые тюльпаны для весенних праздников",
                price: 1999,
                category_name: "Тюльпаны",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 30,
                is_available: true
            },
            {
                id: 3,
                name: "Белые лилии",
                description: "Элегантный букет из белых лилий",
                price: 2999,
                category_name: "Лилии",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 20,
                is_available: true
            },
            {
                id: 4,
                name: "Смешанные весенние цветы",
                description: "Яркие смешанные сезонные цветы",
                price: 2299,
                category_name: "Сезонные",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 25,
                is_available: true
            },
            {
                id: 5,
                name: "Экзотические орхидеи",
                description: "Роскошные орхидеи для особых случаев",
                price: 3499,
                category_name: "Экзотические",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 15,
                is_available: true
            },
            {
                id: 6,
                name: "Солнечные подсолнухи",
                description: "Яркие подсолнухи, поднимающие настроение",
                price: 1799,
                category_name: "Сезонные",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 35,
                is_available: true
            }
        ]
    });
});

app.get('/api/products/categories/all', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: "Розы", description: "Красивые розы для любого случая" },
            { id: 2, name: "Тюльпаны", description: "Яркие тюльпаны для весны" },
            { id: 3, name: "Лилии", description: "Элегантные лилии для особых моментов" },
            { id: 4, name: "Сезонные", description: "Свежие сезонные подборки" },
            { id: 5, name: "Экзотические", description: "Роскошные экзотические цветы" }
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Flowershop работает',
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
    console.log(`🌸 Flowershop запущен на порту ${PORT}`);
    console.log(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}`);
});