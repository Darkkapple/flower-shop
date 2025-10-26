const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Правильная настройка статических файлов
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'))); 
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));

// Session
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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

// API routes
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                name: "Red Roses Bouquet",
                description: "12 beautiful red roses in a elegant arrangement",
                price: 25.99,
                category_name: "Roses",
                image_url: "/images/rose-bouquet.jpg",
                stock_quantity: 50
            },
            {
                id: 2,
                name: "Pink Tulips",
                description: "Fresh pink tulips for spring occasions", 
                price: 19.99,
                category_name: "Tulips",
                image_url: "/images/tulips.jpg",
                stock_quantity: 30
            },
            {
                id: 3,
                name: "White Lilies",
                description: "Elegant white lilies bouquet",
                price: 29.99,
                category_name: "Lilies", 
                image_url: "/images/lilies.jpg",
                stock_quantity: 20
            },
            {
                id: 4,
                name: "Mixed Spring Flowers",
                description: "Colorful mixed seasonal flowers",
                price: 22.99,
                category_name: "Seasonal",
                image_url: "/images/mixed-flowers.jpg",
                stock_quantity: 25
            }
        ]
    });
});

app.get('/api/products/categories/all', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: "Roses", description: "Beautiful roses" },
            { id: 2, name: "Tulips", description: "Colorful tulips" },
            { id: 3, name: "Lilies", description: "Elegant lilies" },
            { id: 4, name: "Seasonal", description: "Seasonal flowers" }
        ]
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Flower Shop is running!' });
});

// Fallback for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Flower Shop running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
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

// API routes (пока заглушки)
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                name: "Red Roses Bouquet",
                description: "12 beautiful red roses",
                price: 25.99,
                category_name: "Roses",
                stock_quantity: 50
            },
            {
                id: 2, 
                name: "Pink Tulips",
                description: "Fresh pink tulips arrangement",
                price: 19.99,
                category_name: "Tulips",
                stock_quantity: 30
            }
        ]
    });
});

// Health check для Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV}`);
});
