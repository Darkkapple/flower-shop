const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Для хостинга обычно сам выбирает порт
const PORT = process.env.PORT || 3000;

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', require('./routes/products'));
// ... другие роуты

// SPA fallback - важно для хостинга!
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});