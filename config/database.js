/**
 * Database configuration for Flower Shop
 * Mock data for development - ИСПРАВЛЕНО: category_id вместо category_ids
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
            created_at: new Date('2024-01-01')
        }
    ],
    products: [
        {
            id: 1,
            name: "Фикус",
            description: "Классическое комнатное растение, неприхотливое в уходе",
            price: 300,
            category_id: 2, // Для опытных
            image_url: "/images/fikus.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 2,
            name: "Замиокулькас",
            description: "Долларовое дерево, очень выносливое растение",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "/images/zamioculcas.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 3,
            name: "Финиковая пальма",
            description: "Экзотическое растение, требует просторного помещения",
            price: 500,
            category_id: 2, // Для опытных
            image_url: "/images/palma.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 4,
            name: "Монстера",
            description: "Крупное растение с резными листьями",
            price: 1000,
            category_id: 2, // Для опытных
            image_url: "/images/monstera.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 5,
            name: "Аглаонема",
            description: "Декоративно-лиственное растение с красивыми узорами",
            price: 450,
            category_id: 1, // Для начинающих
            image_url: "/images/aglaonema.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 6,
            name: "Сансевиерия",
            description: "Щучий хвост, одно из самых неприхотливых растений",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "/images/sansevieria.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 7,
            name: "Юкка",
            description: "Древовидное растение, напоминающее пальму",
            price: 400,
            category_id: 2, // Для опытных
            image_url: "/images/yucca.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 8,
            name: "Спатифиллум",
            description: "Женское счастье, цветет белыми цветами",
            price: 200,
            category_id: 2, // Для опытных
            image_url: "/images/spathiphyllum.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 9,
            name: "Фикус бенджамина",
            description: "Популярное деревце для дома и офиса",
            price: 250,
            category_id: 2, // Для опытных
            image_url: "/images/fikus-benjamina.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 10,
            name: "Антуриум",
            description: "Мужское счастье, яркие красные цветы",
            price: 600,
            category_id: 2, // Для опытных
            image_url: "/images/anthurium.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 11,
            name: "Хлорофитум",
            description: "Отличный очиститель воздуха, очень неприхотлив",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "/images/chlorophytum.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 12,
            name: "Алоказия",
            description: "Тропическое растение с крупными листьями",
            price: 600,
            category_id: 3, // Капризные
            image_url: "/images/alocasia.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 13,
            name: "Хамедорея",
            description: "Бамбуковая пальма, хорошо растет в тени",
            price: 350,
            category_id: 2, // Для опытных
            image_url: "/images/chamaedorea.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 14,
            name: "Кротон",
            description: "Яркие разноцветные листья, требует много света",
            price: 550,
            category_id: 3, // Капризные
            image_url: "/images/croton.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 15,
            name: "Филодендрон",
            description: "Лиана с красивыми сердцевидными листьями",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "/images/philodendron.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 16,
            name: "Орхидея",
            description: "Королева комнатных растений, капризна в уходе",
            price: 750,
            category_id: 3, // Капризные
            image_url: "/images/orchid.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 17,
            name: "Папоротник",
            description: "Нефролепис, любит влажность и полутень",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "/images/fern.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 18,
            name: "Калатея",
            description: "Молитвенный цветок, очень капризная",
            price: 550,
            category_id: 3, // Капризные
            image_url: "/images/calathea.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 19,
            name: "Шефлера",
            description: "Зонтичное дерево, подходит для начинающих",
            price: 650,
            category_id: 1, // Для начинающих
            image_url: "/images/schefflera.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 20,
            name: "Стрелиция",
            description: "Райская птица, очень эффектное растение",
            price: 1500,
            category_id: 3, // Капризные
            image_url: "/images/strelitzia.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 21,
            name: "Эпипремнум",
            description: "Золотой потос, одно из самых простых растений",
            price: 400,
            category_id: 1, // Для начинающих
            image_url: "/images/epipremnum.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 22,
            name: "Бегония",
            description: "Красивоцветущее растение с резными листьями",
            price: 250,
            category_id: 2, // Для опытных
            image_url: "/images/begonia.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 23,
            name: "Фикус лирата",
            description: "Скрипичный фикус с крупными листьями",
            price: 650,
            category_id: 2, // Для опытных
            image_url: "/images/fikus-lirata.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 24,
            name: "Традесканция",
            description: "Ампельное растение, очень быстро растет",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "/images/tradescantia.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 25,
            name: "Сингониум",
            description: "Лиана с наконечниковидными листьями",
            price: 300,
            category_id: 2, // Для опытных
            image_url: "/images/syngonium.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 26,
            name: "Хойя",
            description: "Восковой плющ, красиво цветет",
            price: 450,
            category_id: 1, // Для начинающих
            image_url: "/images/hoya.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 27,
            name: "Денежное дерево",
            description: "Толстянка, растение-талисман",
            price: 550,
            category_id: 1, // Для начинающих
            image_url: "/images/crassula.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 28,
            name: "Сциндапсус",
            description: "Быстрорастущая лиана, очень неприхотлив",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "/images/scindapsus.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 29,
            name: "Диффенбахия",
            description: "Крупное растение с пестрыми листьями",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "/images/dieffenbachia.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 30,
            name: "Кактус",
            description: "Коллекционный кактус, не требует частого полива",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "/images/cactus.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 31,
            name: "Суккуленты",
            description: "Микс из разных видов суккулентов",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "/images/succulents.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 32,
            name: "Гибискус",
            description: "Китайская роза, крупные яркие цветы",
            price: 300,
            category_id: 3, // Капризные
            image_url: "/images/hibiscus.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 33,
            name: "Мирт",
            description: "Ароматное деревце, символ мира и любви",
            price: 500,
            category_id: 3, // Капризные
            image_url: "/images/myrtus.jpg",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        }
    ],
    categories: [
        { id: 1, name: "Для начинающих", description: "Подходит для новичков, неприхотливые растения", slug: "for_beginners" },
        { id: 2, name: "Для опытных", description: "Требуют определенных навыков ухода", slug: "for_the_experienced" },
        { id: 3, name: "Капризные", description: "Требовательные к условиям содержания", slug: "moody" },
        { id: 4, name: "Яркий и рассеянный свет", description: "Любят много света, но не прямые лучи", slug: "bright_and_diffused_light" },
        { id: 5, name: "Полутень", description: "Хорошо растут в полутени", slug: "partial_shade" },
        { id: 6, name: "Тень", description: "Могут расти в тенистых местах", slug: "shadow" },
        { id: 7, name: "Декоративно-лиственные", description: "Ценятся за красоту листьев", slug: "decorative_and_deciduous" },
        { id: 8, name: "Красивоцветущие", description: "Радуют красивым цветением", slug: "beautifully_blooming" },
        { id: 9, name: "Ампельные и лианы", description: "Вьющиеся и свисающие растения", slug: "ampellae_and_creepers" },
        { id: 10, name: "Деревья и кустарники", description: "Крупные древовидные формы", slug: "trees_and_shrubs" },
        { id: 11, name: "Пальмовидные", description: "Напоминают пальмы", slug: "palm_shaped" },
        { id: 12, name: "Розеточные", description: "Растения с розеточной формой роста", slug: "sockets" },
        { id: 13, name: "Суккуленты", description: "Запасают воду в листьях", slug: "succulents" },
        { id: 14, name: "Растения-очистители воздуха", description: "Очищают воздух от токсинов", slug: "plants_are_air_purifiers" },
        { id: 15, name: "Тропиканы", description: "Тропические растения, любят влажность", slug: "tropical_that_love_humidity" }
    ],
    orders: [],
    order_items: []
};

// Маппинг сложности на основе category_id
const DIFFICULTY_MAP = {
    1: { level: 'beginner', name: '🌱 Для начинающих', badge: 'beginner' },
    2: { level: 'expert', name: '🌟 Для опытных', badge: 'expert' },
    3: { level: 'hard', name: '⚠️ Капризные', badge: 'hard' }
};

// Database connection wrapper for MOCK DATA
class Database {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.isConnected = true;
        console.log('📊 Мок-база данных успешно подключена');
        return this;
    }

    async query(sql, params = []) {
        if (!this.isConnected) {
            await this.connect();
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        console.log('📊 Выполняющий запрос:', sql, params);

        // Обработка различных типов запросов
        if (sql.includes('FROM products') || sql.includes('FROM products')) {
            let products = [...mockDatabase.products];

            // Добавляем информацию о категориях
            products = products.map(product => {
                const category = mockDatabase.categories.find(c => c.id === product.category_id) || {
                    name: 'Растение',
                    slug: 'plant',
                    description: ''
                };
                const difficulty = DIFFICULTY_MAP[product.category_id] || {
                    level: 'medium',
                    name: '🌿 Обычный',
                    badge: 'medium'
                };

                return {
                    ...product,
                    category_name: category.name,
                    category_slug: category.slug,
                    difficulty: difficulty.level,
                    difficulty_name: difficulty.name,
                    difficulty_badge: difficulty.badge
                };
            });

            // Фильтрация по ID если есть
            if (sql.includes('WHERE p.id = ?') || sql.includes('WHERE id = ?')) {
                const id = parseInt(params[0]);
                products = products.filter(p => p.id === id);
            }

            return [products];
        } else if (sql.includes('FROM categories')) {
            return [mockDatabase.categories];
        } else if (sql.includes('FROM users')) {
            return [mockDatabase.users];
        } else if (sql.includes('FROM orders')) {
            return [mockDatabase.orders || []];
        } else if (sql.includes('INSERT INTO products')) {
            return [{ insertId: mockDatabase.products.length + 1 }];
        } else if (sql.includes('UPDATE products')) {
            return [{ affectedRows: 1 }];
        } else if (sql.includes('DELETE FROM products')) {
            return [{ affectedRows: 1 }];
        } else if (sql.includes('INSERT INTO orders')) {
            const newOrder = {
                id: (mockDatabase.orders?.length || 0) + 1,
                ...params.reduce((acc, val, i) => {
                    const fields = ['user_id', 'total_amount', 'customer_name', 'customer_email', 'customer_phone', 'delivery_address'];
                    acc[fields[i]] = val;
                    return acc;
                }, {}),
                status: 'pending',
                created_at: new Date()
            };
            if (!mockDatabase.orders) mockDatabase.orders = [];
            mockDatabase.orders.push(newOrder);
            return [{ insertId: newOrder.id }];
        } else if (sql.includes('INSERT INTO order_items')) {
            if (!mockDatabase.order_items) mockDatabase.order_items = [];
            return [{ insertId: mockDatabase.order_items.length + 1 }];
        }

        return [[]];
    }

    async execute(sql, params = []) {
        return this.query(sql, params);
    }

    async getConnection() {
        return this;
    }

    async beginTransaction() {
        // Мок транзакции
    }

    async commit() {
        // Мок коммит
    }

    async rollback() {
        // Мок откат
    }

    release() {
        // Мок освобождение
    }
}

// Create and export database instance
const db = new Database();

module.exports = db;