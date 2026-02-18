-- ==========================================
-- Database Schema for Wallet Backend
-- ==========================================

DROP TABLE IF EXISTS wallet_transactions CASCADE;

DROP TABLE IF EXISTS wallets CASCADE;

-- ==========================================
-- Wallets Table
-- ==========================================

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    coin_balance INTEGER DEFAULT 0 CHECK (coin_balance >= 0),
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (
        status IN (
            'ACTIVE',
            'FROZEN',
            'SUSPENDED'
        )
    ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id)
);

-- ==========================================
-- Wallets Transactions Table
-- ==========================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255),
    order_id VARCHAR(255),
    payment_amount DECIMAL(10, 2),
    combo_items JSONB,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (
        transaction_type IN (
            'CREDIT',
            'DEBIT',
            'REFERRAL_BONUS',
            'PRACTICE_ENTRY',
            'PRACTICE_REFUND',
            'TOURNAMENT_ENTRY',
            'TOURNAMENT_REWARD',
            'TOURNAMENT_CANCELLED_REFUND',
            'ADMIN_CREDIT',
            'ADMIN_DEBIT',
            'PURCHASE',
            'REWARD'
        )
    ),
    amount INTEGER NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    description TEXT,
    metadata JSONB,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (
        status IN (
            'PENDING',
            'COMPLETED',
            'FAILED',
            'REVERSED'
        )
    ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Coin Bundles Table
CREATE TABLE IF NOT EXISTS coin_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    coins INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bonus_coins INTEGER DEFAULT 0,
    title VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'INACTIVE')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Orders Table
CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    bundle_id UUID REFERENCES coin_bundles (id),
    order_id VARCHAR(255) UNIQUE NOT NULL,
    gateway_order_id VARCHAR(255),
    coins INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN (
            'PENDING',
            'PROCESSING',
            'COMPLETED',
            'FAILED',
            'ABANDONED',
            'REFUNDED'
        )
    ),
    payment_method VARCHAR(50),
    gateway_response JSONB,
    callback_received_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets (user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions (user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions (wallet_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference_id ON wallet_transactions (reference_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coin_bundles_status ON coin_bundles (status);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders (user_id);

CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders (status);

CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders (order_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_order_id ON wallet_transactions (order_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to wallets table
CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coin_bundles_updated_at 
    BEFORE UPDATE ON coin_bundles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_orders_updated_at 
    BEFORE UPDATE ON payment_orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO
    coin_bundles (
        coins,
        price,
        title,
        display_order,
        is_popular
    )
VALUES (
        65,
        11.00,
        '65 Coins',
        1,
        false
    ),
    (
        350,
        55.00,
        '350 Coins',
        2,
        false
    ),
    (
        750,
        110.00,
        '750 Coins',
        3,
        true
    ),
    (
        1600,
        220.00,
        '1600 Coins',
        4,
        false
    ),
    (
        4200,
        550.00,
        '4200 Coins',
        5,
        false
    ),
    (
        8400,
        1100.00,
        '8400 Coins',
        6,
        false
    ) ON CONFLICT DO NOTHING;
-- ==========================================
-- Success Notification
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '   Core tables:  wallets, transanctions';
    RAISE NOTICE '   Status: All constraints, indexes & triggers applied';
END $$;