/**
 * Database configuration for Flower Shop
 * Currently using mock data, but ready for MySQL/PostgreSQL integration
 */

// Mock database for development
const mockDatabase = {
    users: [
        {
            id: 1,
            username: 'admin',
            email: 'admin@flowershop.com',
            password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewd.BRj2uM7SNqje', // admin123
            is_admin: true,
            created_at: new Date('1001-10-01')
        }
    ],
    products: [
        {
            id: 1,
            name: "Red Roses Bouquet",
            description: "12 beautiful red roses in an elegant arrangement",
            price: 25.99,
            category_id: 1,
            image_url: "/images/rose-bouquet.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 2,
            name: "Pink Tulips",
            description: "Fresh pink tulips for spring occasions",
            price: 19.99,
            category_id: 2,
            image_url: "/images/tulips.jpg",
            stock_quantity: 30,
            is_available: true,
            created_at: new Date('2024-01-01')
        }
    ],
    categories: [
        { id: 1, name: "Roses", description: "Beautiful roses for every occasion" },
        { id: 2, name: "Tulips", description: "Colorful tulips for spring" },
        { id: 3, name: "Lilies", description: "Elegant lilies for special moments" },
        { id: 4, name: "Seasonal", description: "Fresh seasonal selections" }
    ]
};

// Database connection wrapper
class Database {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        // Simulate database connection
        await new Promise(resolve => setTimeout(resolve, 100));
        this.isConnected = true;
        console.log('📊 Database connected successfully');
        return this;
    }

    async query(sql, params = []) {
        if (!this.isConnected) {
            await this.connect();
        }

        // Simulate query execution
        await new Promise(resolve => setTimeout(resolve, 50));
        
        console.log('📊 Executing query:', sql, params);
        
        // Mock query results based on SQL
        if (sql.includes('SELECT * FROM products')) {
            return [mockDatabase.products];
        } else if (sql.includes('SELECT * FROM categories')) {
            return [mockDatabase.categories];
        } else if (sql.includes('SELECT * FROM users')) {
            return [mockDatabase.users];
        }
        
        return [[]];
    }

    async execute(sql, params = []) {
        return this.query(sql, params);
    }
}

// Create and export database instance
const db = new Database();

module.exports = db;
