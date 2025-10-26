const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false
}));

// Performance middleware
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'flower-shop-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
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

// API Routes
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                name: "Red Roses Bouquet",
                description: "12 beautiful red roses in an elegant arrangement",
                price: 25.99,
                category_name: "Roses",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 50,
                is_available: true
            },
            {
                id: 2,
                name: "Pink Tulips",
                description: "Fresh pink tulips for spring occasions",
                price: 19.99,
                category_name: "Tulips",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 30,
                is_available: true
            },
            {
                id: 3,
                name: "White Lilies",
                description: "Elegant white lilies bouquet",
                price: 29.99,
                category_name: "Lilies",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 20,
                is_available: true
            },
            {
                id: 4,
                name: "Mixed Spring Flowers",
                description: "Colorful mixed seasonal flowers",
                price: 22.99,
                category_name: "Seasonal",
                image_url: "/images/placeholder.jpg",
                stock_quantity: 25,
                is_available: true
            }
        ]
    });
});

app.get('/api/products/categories/all', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: "Roses", description: "Beautiful roses for every occasion" },
            { id: 2, name: "Tulips", description: "Colorful tulips for spring" },
            { id: 3, name: "Lilies", description: "Elegant lilies for special moments" },
            { id: 4, name: "Seasonal", description: "Fresh seasonal selections" }
        ]
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Flower Shop API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Debug endpoint to check file structure
app.get('/debug/files', (req, res) => {
    const fs = require('fs');
    const getFiles = (dir, prefix = '') => {
        try {
            const files = fs.readdirSync(dir);
            return files.map(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    return { name: prefix + file + '/', type: 'directory' };
                } else {
                    return { name: prefix + file, type: 'file', size: stat.size };
                }
            });
        } catch (error) {
            return [{ name: `Error reading ${dir}: ${error.message}`, type: 'error' }];
        }
    };

    res.json({
        public: getFiles(path.join(__dirname, 'public')),
        views: getFiles(path.join(__dirname, 'views')),
        currentDir: __dirname
    });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Flower Shop running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
