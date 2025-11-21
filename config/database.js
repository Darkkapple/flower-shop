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
    ],
    categories: [
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
        console.log('📊  База данных успешно подключена');
        return this;
    }

    async query(sql, params = []) {
        if (!this.isConnected) {
            await this.connect();
        }

        // Simulate query execution
        await new Promise(resolve => setTimeout(resolve, 50));
        
        console.log('📊 Выполняющий запрос:', sql, params);
        
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
