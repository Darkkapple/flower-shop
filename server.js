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
            name: "Фикус", //Название
            description: "", //Описание
            price: 300, //Цена
            category_id: 2;4;7;10;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
         {
            id: 2,
            name: "Замиокулькас", //Название
            description: "", //Описание
            price: 350, //Цена
            category_id: 1;6;7;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 3,
            name: "Финиковая пальма", //Название
            description: "", //Описание
            price: 500, //Цена
            category_id: 2;4;11,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 4,
            name: "Монстера", //Название
            description: "", //Описание
            price: 1000, //Цена
            category_id: 2;4;7;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 5,
            name: "Аглаонема", //Название
            description: "", //Описание
            price: 450, //Цена
            category_id: 1;5;7;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 6,
            name: "Сансевиерия", //Название
            description: "", //Описание
            price: 350, //Цена
            category_id: 1;6;7;12;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 7,
            name: "Юкка", //Название
            description: "", //Описание
            price: 400, //Цена
            category_id: 2;4;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 8,
            name: "Спатифиллум", //Название
            description: "", //Описание
            price: 200, //Цена
            category_id: 2;5;8;12;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 9,
            name: "Фикус бенджамина", //Название
            description: "", //Описание
            price: 250, //Цена
            category_id: 2;4;7;10;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 10,
            name: "Антуриум", //Название
            description: "", //Описание
            price: 600, //Цена
            category_id: 2;5;7;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 11,
            name: "Хлорофитум", //Название
            description: "", //Описание
            price: 350, //Цена
            category_id: 1;6;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 12,
            name: "Алоказия", //Название
            description: "", //Описание
            price: 600, //Цена
            category_id: 3;4;7;12;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 13,
            name: "Хамедорея", //Название
            description: "", //Описание
            price: 350, //Цена
            category_id: 2;5;11;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 14,
            name: "Кротон", //Название
            description: "", //Описание
            price: 550, //Цена
            category_id: 3;4;7;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 15,
            name: "Филодендрон", //Название
            description: "", //Описание
            price: 450, //Цена
            category_id: 2;6;9;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 16,
            name: "Орхидея", //Название
            description: "", //Описание
            price: 750, //Цена
            category_id: 2;5;8,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 17,
            name: "Папоротник", //Название
            description: "", //Описание
            price: 450, //Цена
            category_id: 3;5;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 18,
            name: "Калатея", //Название
            description: "", //Описание
            price: 550, //Цена
            category_id: 3;5,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 19,
            name: "Шефлера", //Название
            description: "", //Описание
            price: 650, //Цена
            category_id: 1;5;7;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 20,
            name: "Стрелиция", //Название
            description: "", //Описание
            price: 1500, //Цена
            category_id: 3;4;8,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 21,
            name: "Эпипремнум", //Название
            description: "", //Описание
            price: 400, //Цена
            category_id: 1;6;9;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 22,
            name: "Бегония", //Название
            description: "", //Описание
            price: 250, //Цена
            category_id: 2;5;12;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 23,
            name: "Фикус лирата", //Название
            description: "", //Описание
            price: 650, //Цена
            category_id: 2;6;7;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 24,
            name: "Традесканция", //Название
            description: "", //Описание
            price: 200, //Цена
            category_id: 1;6;9,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 25,
            name: "Сингониум", //Название
            description: "", //Описание
            price: 300, //Цена
            category_id: 2;6;9;15,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 26,
            name: "Хойя", //Название
            description: "", //Описание
            price: 450, //Цена
            category_id: 1;4;8;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 27,
            name: "Денежное дерево", //Название
            description: "", //Описание
            price: 550, //Цена
            category_id: 1;4;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 28,
            name: "Сциндапсус", //Название
            description: "", //Описание
            price: 200, //Цена
            category_id: 1;6;9;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 29,
            name: "Диффенбахия", //Название
            description: "", //Описание
            price: 450, //Цена
            category_id: 2;5;7;14,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 30,
            name: "Кактус", //Название
            description: "", //Описание
            price: 200, //Цена
            category_id: 1;4;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 31,
            name: "Суккуленты", //Название
            description: "", //Описание
            price: 200, //Цена
            category_id: 1;4;13,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 32,
            name: "Гибискус", //Название
            description: "", //Описание
            price: 300, //Цена
            category_id: 3;4;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        {
            id: 33,
            name: "Мирт", //Название
            description: "", //Описание
            price: 500, //Цена
            category_id: 3;4;8;10,
            image_url: "/images/", //путь к картинке
            stock_quantity: 50, //Кол-во на складе
            is_available: true, //Доступен да(true)/нет(false)
            created_at: new Date('2024-01-01')
        },
        ]
    });
});

app.get('/api/products/categories/all', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: "Для начинающих", description: "" },
        { id: 2, name: "Для опытных", description: "" },
        { id: 3, name: "Капризные", description: "" },
        { id: 4, name: "Яркий и рассеянный свет", description: "" },
        { id: 5, name: "Полутень", description: "" },
        { id: 6, name: "Тень", description: "" },
        { id: 7, name: "Декоративно-лиственные", description: "" },
        { id: 8, name: "Красивоцветущие", description: "" },
        { id: 9, name: "Ампельные и лианы", description: "" },
        { id: 10, name: "Деревья и кустарники", description: "" },
        { id: 11, name: "Пальмовидные", description: "" },
        { id: 12, name: "Розеточные", description: "" },
        { id: 13, name: "Суккуленты", description: "" },
        { id: 14, name: "Растения-очистители воздуха", description: "" },
        { id: 15, name: "Тропиканы", description: "" },
        ]
    });
});

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
});
