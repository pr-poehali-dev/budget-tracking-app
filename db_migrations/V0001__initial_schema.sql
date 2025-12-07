-- Создание таблицы счетов (банковские карты, наличные и т.д.)
CREATE TABLE IF NOT EXISTS t_p20799998_budget_tracking_app.accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'Wallet',
    color VARCHAR(100) DEFAULT 'from-slate-400 to-slate-600',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS t_p20799998_budget_tracking_app.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS t_p20799998_budget_tracking_app.transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    category_id INTEGER REFERENCES t_p20799998_budget_tracking_app.categories(id),
    account_id INTEGER REFERENCES t_p20799998_budget_tracking_app.accounts(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных счетов
INSERT INTO t_p20799998_budget_tracking_app.accounts (name, type, balance, icon, color) VALUES
('Тинькофф Black', 'card', 48850.00, 'CreditCard', 'from-yellow-400 to-yellow-600'),
('Сбербанк', 'card', 12500.00, 'CreditCard', 'from-green-400 to-green-600'),
('Наличные', 'cash', 5000.00, 'Wallet', 'from-slate-400 to-slate-600');

-- Вставка начальных категорий доходов
INSERT INTO t_p20799998_budget_tracking_app.categories (name, icon, color, type) VALUES
('Зарплата', 'Briefcase', 'bg-emerald-500', 'income'),
('Фриланс', 'Laptop', 'bg-blue-500', 'income'),
('Инвестиции', 'TrendingUp', 'bg-purple-500', 'income');

-- Вставка начальных категорий расходов
INSERT INTO t_p20799998_budget_tracking_app.categories (name, icon, color, type) VALUES
('Продукты', 'ShoppingCart', 'bg-orange-500', 'expense'),
('Транспорт', 'Car', 'bg-red-500', 'expense'),
('Развлечения', 'Gamepad2', 'bg-pink-500', 'expense'),
('Здоровье', 'Heart', 'bg-rose-500', 'expense'),
('Образование', 'GraduationCap', 'bg-indigo-500', 'expense');

-- Вставка примерных транзакций
INSERT INTO t_p20799998_budget_tracking_app.transactions (type, amount, category_id, account_id, date, description) VALUES
('income', 50000.00, 1, 1, '2025-12-01', 'Зарплата за ноябрь'),
('expense', 1200.00, 4, 1, '2025-12-02', 'Пятёрочка'),
('expense', 850.00, 5, 3, '2025-12-03', 'Заправка'),
('income', 15000.00, 2, 2, '2025-12-04', 'Проект для клиента'),
('expense', 3500.00, 6, 1, '2025-12-05', 'Кино и ресторан'),
('expense', 2800.00, 7, 2, '2025-12-06', 'Аптека'),
('income', 8000.00, 3, 1, '2025-12-07', 'Дивиденды');

-- Создание индексов для быстрого поиска
CREATE INDEX idx_transactions_date ON t_p20799998_budget_tracking_app.transactions(date);
CREATE INDEX idx_transactions_type ON t_p20799998_budget_tracking_app.transactions(type);
CREATE INDEX idx_transactions_account ON t_p20799998_budget_tracking_app.transactions(account_id);
CREATE INDEX idx_categories_type ON t_p20799998_budget_tracking_app.categories(type);