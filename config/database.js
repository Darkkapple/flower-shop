/**
 * Database configuration for Flower Shop
 * Mock data for development - С РЕАЛЬНЫМИ ФОТО И ВСЕМИ КАТЕГОРИЯМИ!
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
            description: "Классическое комнатное растение с глянцевыми листьями. Отлично очищает воздух.",
            price: 300,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 2,
            name: "Замиокулькас",
            description: "Долларовое дерево - очень выносливое растение, прощает забывчивость в поливе.",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 3,
            name: "Финиковая пальма",
            description: "Экзотическая пальма, которая создает атмосферу тропиков в вашем доме.",
            price: 500,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1597055181300-36260a34270a?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 4,
            name: "Монстера",
            description: "Крупное растение с резными листьями. Быстро растет и создает уют.",
            price: 1000,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 5,
            name: "Аглаонема",
            description: "Декоративно-лиственное растение с красивыми узорами на листьях.",
            price: 450,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 6,
            name: "Сансевиерия",
            description: "Щучий хвост - одно из самых неприхотливых растений. Выживает даже в темных углах.",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 7,
            name: "Юкка",
            description: "Древовидное растение, напоминающее пальму. Любит яркий свет.",
            price: 400,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1597055181300-36260a34270a?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 8,
            name: "Спатифиллум",
            description: "Женское счастье - красиво цветет белыми цветами. Любит влажность.",
            price: 200,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 9,
            name: "Фикус бенджамина",
            description: "Популярное деревце для дома и офиса. Можно формировать крону обрезкой.",
            price: 250,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 10,
            name: "Антуриум",
            description: "Мужское счастье - яркие красные цветы в форме сердца.",
            price: 600,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 11,
            name: "Хлорофитум",
            description: "Отличный очиститель воздуха. Очень неприхотлив, быстро размножается.",
            price: 350,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 12,
            name: "Алоказия",
            description: "Тропическое растение с крупными листьями. Любит высокую влажность.",
            price: 600,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 13,
            name: "Хамедорея",
            description: "Бамбуковая пальма - хорошо растет в тени, не требует яркого света.",
            price: 350,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1597055181300-36260a34270a?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 14,
            name: "Кротон",
            description: "Яркие разноцветные листья - настоящее украшение коллекции.",
            price: 550,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 15,
            name: "Филодендрон",
            description: "Лиана с красивыми сердцевидными листьями. Хорошо растет в полутени.",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 16,
            name: "Орхидея",
            description: "Королева комнатных растений. Требовательна к уходу, но очень красива.",
            price: 750,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1463320898484-edde836c197b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 17,
            name: "Папоротник",
            description: "Нефролепис - любит влажность и полутень. Отлично освежает интерьер.",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 18,
            name: "Калатея",
            description: "Молитвенный цветок - листья складываются на ночь. Капризная красавица.",
            price: 550,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 19,
            name: "Шефлера",
            description: "Зонтичное дерево - подходит для начинающих. Быстро растет.",
            price: 650,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 20,
            name: "Стрелиция",
            description: "Райская птица - очень эффектное растение с цветами, похожими на птиц.",
            price: 1500,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1597055181300-36260a34270a?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 21,
            name: "Эпипремнум",
            description: "Золотой потос - одно из самых простых растений. Быстро растет даже в тени.",
            price: 400,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 22,
            name: "Бегония",
            description: "Красивоцветущее растение с резными листьями. Любит яркий рассеянный свет.",
            price: 250,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 23,
            name: "Фикус лирата",
            description: "Скрипичный фикус с крупными волнистыми листьями. Любит яркий свет.",
            price: 650,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 24,
            name: "Традесканция",
            description: "Ампельное растение с разноцветными листьями. Очень быстро растет.",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 25,
            name: "Сингониум",
            description: "Лиана с наконечниковидными листьями. Хорошо растет в полутени.",
            price: 300,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 26,
            name: "Хойя",
            description: "Восковой плющ - красиво цветет ароматными звездчатыми цветами.",
            price: 450,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 27,
            name: "Денежное дерево",
            description: "Толстянка - растение-талисман для привлечения денег. Неприхотливый суккулент.",
            price: 550,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 28,
            name: "Сциндапсус",
            description: "Быстрорастущая лиана с пятнистыми листьями. Очень неприхотлив.",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 29,
            name: "Диффенбахия",
            description: "Крупное растение с пестрыми листьями. Сок ядовит, держите подальше от детей.",
            price: 450,
            category_id: 2, // Для опытных
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 30,
            name: "Кактус",
            description: "Коллекционный кактус. Не требует частого полива, любит яркое солнце.",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1459411552882-8414bd98725e?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 31,
            name: "Суккуленты",
            description: "Микс из разных видов суккулентов. Идеальны для занятых людей.",
            price: 200,
            category_id: 1, // Для начинающих
            image_url: "https://images.unsplash.com/photo-1459411552882-8414bd98725e?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 32,
            name: "Гибискус",
            description: "Китайская роза - крупные яркие цветы. Любит яркий свет и обильный полив.",
            price: 300,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1597055181300-36260a34270a?w=400&h=400&fit=crop",
            stock_quantity: 50,
            is_available: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 33,
            name: "Мирт",
            description: "Ароматное деревце с мелкими листьями. Символ мира и любви.",
            price: 500,
            category_id: 3, // Капризные
            image_url: "https://images.unsplash.com/photo-1593691509543-55b32d7edb2c?w=400&h=400&fit=crop",
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

        if (sql.includes('FROM products')) {
            let products = [...mockDatabase.products];

            // Добавляем информацию о категориях
            products = products.map(product => {
                const category = mockDatabase.categories.find(c => c.id === product.category_id) || {
                    name: 'Растение',
                    slug: 'plant',
                    description: ''
                };

                return {
                    ...product,
                    category_name: category.name,
                    category_slug: category.slug
                };
            });

            // Фильтрация по ID
            if (sql.includes('WHERE id = ?') || sql.includes('WHERE p.id = ?')) {
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
        } else if (sql.includes('FROM order_items')) {
            return [mockDatabase.order_items || []];
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

    async beginTransaction() {}
    async commit() {}
    async rollback() {}
    release() {}
}

const db = new Database();
module.exports = db;