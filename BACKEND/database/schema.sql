-- ==========================================
-- Database Schema for Authentication Backend
-- ==========================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_categories CASCADE;

DROP TABLE IF EXISTS user_roles CASCADE;

DROP TABLE IF EXISTS notification_delivery_log CASCADE;

DROP TABLE IF EXISTS user_fcm_tokens CASCADE;

DROP TABLE IF EXISTS admin_notification_targets CASCADE;

DROP TABLE IF EXISTS admin_notification_campaigns CASCADE;

DROP TABLE IF EXISTS user_notifications CASCADE;

DROP TABLE IF EXISTS user_notification_preferences CASCADE;

DROP TABLE IF EXISTS referrals CASCADE;

DROP TABLE IF EXISTS user_devices CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS referral_config CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- Users Table
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (
        role IN (
            'USER',
            'ADMIN',
            'SUPER_ADMIN'
        )
    ),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users (id),
    referral_code_generated_at TIMESTAMPTZ,
    admin_permissions JSONB DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (
        status IN ('ACTIVE', 'BLOCKED')
    ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

-- ==========================================
-- User Devices Table
-- ==========================================
CREATE TABLE user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    device_info JSONB,
    last_login_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'TRUSTED' CHECK (
        status IN ('TRUSTED', 'BLOCKED')
    ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Referrals Table
-- ==========================================

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    referrer_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN (
            'APPLIED',
            'PENDING',
            'COMPLETED',
            'INVALID'
        )
    ),
    coins_awarded INTEGER DEFAULT 0,
    eligibility_met BOOLEAN DEFAULT FALSE,
    eligibility_met_at TIMESTAMPTZ,
    ip_address VARCHAR(50),
    device_fingerprint VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_referral_pair UNIQUE (
        referrer_user_id,
        referred_user_id
    ),
    CONSTRAINT chk_no_self_referral CHECK (
        referrer_user_id <> referred_user_id
    )
);
-- ==========================================
-- Referral Configuration Table
-- ==========================================

CREATE TABLE IF NOT EXISTS referral_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    coins_per_referral INTEGER DEFAULT 50,
    referee_bonus_coins INTEGER DEFAULT 0,
    eligibility_action VARCHAR(50) DEFAULT 'FIRST_WALLET_ADD',
    max_referrals_per_user INTEGER DEFAULT NULL,
    referral_expiry_days INTEGER DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_referral_config_active UNIQUE (is_active)
);

INSERT INTO
    referral_config (
        coins_per_referral,
        referee_bonus_coins,
        eligibility_action,
        is_active
    )
VALUES (
        50,
        0,
        'FIRST_WALLET_ADD',
        TRUE
    ) ON CONFLICT (is_active) DO NOTHING;

-- ==========================================
-- Admin Notification Campaigns Table
-- ==========================================

CREATE TABLE IF NOT EXISTS admin_notification_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (
        category IN (
            'SYSTEM',
            'GAME',
            'OFFER',
            'REMINDER',
            'INFO'
        )
    ),
    target_type VARCHAR(20) NOT NULL CHECK (
        target_type IN (
            'ALL',
            'SEGMENT',
            'CUSTOM',
            'SINGLE'
        )
    ),
    target_segment VARCHAR(50),
    screen_redirect VARCHAR(100),
    data JSONB,
    schedule_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'CREATED' CHECK (
        status IN (
            'CREATED',
            'SCHEDULED',
            'PROCESSING',
            'SENT',
            'FAILED',
            'CANCELLED'
        )
    ),
    total_users INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users (id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ
);

-- ==========================================
-- User Notifications Table
-- ==========================================

CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (
        category IN (
            'SYSTEM',
            'GAME',
            'OFFER',
            'REMINDER',
            'INFO'
        )
    ),
    delivery_mode VARCHAR(20) DEFAULT 'BOTH' CHECK (
        delivery_mode IN ('IN_APP', 'PUSH', 'BOTH')
    ),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    screen_redirect VARCHAR(100),
    data JSONB,
    campaign_id UUID,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Campaign Targets (for custom user lists)
-- ==========================================

CREATE TABLE IF NOT EXISTS admin_notification_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    campaign_id UUID NOT NULL REFERENCES admin_notification_campaigns (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (campaign_id, user_id)
);

-- ==========================================
-- FCM Tokens Table
-- ==========================================

CREATE TABLE IF NOT EXISTS user_fcm_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    device_type VARCHAR(20) CHECK (
        device_type IN ('android', 'ios', 'web')
    ),
    device_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, fcm_token)
);

-- ==========================================
-- Notification Delivery Log
-- ==========================================

CREATE TABLE IF NOT EXISTS notification_delivery_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    notification_id UUID REFERENCES user_notifications (id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    delivery_type VARCHAR(20) NOT NULL CHECK (
        delivery_type IN ('PUSH', 'IN_APP')
    ),
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'SUCCESS',
            'FAILED',
            'PENDING'
        )
    ),
    error_message TEXT,
    fcm_message_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Notification Preferences (Future Enhancement)
-- ==========================================

CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID UNIQUE NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    enable_push BOOLEAN DEFAULT TRUE,
    enable_game_notifications BOOLEAN DEFAULT TRUE,
    enable_offer_notifications BOOLEAN DEFAULT TRUE,
    enable_system_notifications BOOLEAN DEFAULT TRUE,
    enable_reminder_notifications BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Tournaments Table
-- ==========================================
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Tournament Participants Table
-- ==========================================

CREATE TABLE IF NOT EXISTS tournament_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tournament_id UUID NOT NULL REFERENCES tournaments (id),
    user_id UUID NOT NULL REFERENCES users (id),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tournament_id, user_id)
);
-- ==========================================
-- Indexes
-- ==========================================
CREATE INDEX idx_users_firebase_uid ON users (firebase_uid);

CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users (referral_code);

CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users (referred_by);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_mobile ON users (mobile);

CREATE INDEX idx_users_status ON users (status);

CREATE INDEX idx_user_devices_user_id ON user_devices (user_id);

CREATE INDEX idx_user_devices_fingerprint ON user_devices (device_fingerprint);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals (referred_user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals (status);

CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

CREATE UNIQUE INDEX IF NOT EXISTS uq_referral_config_single_active ON referral_config (is_active)
WHERE
    is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications (is_read);

CREATE INDEX IF NOT EXISTS idx_user_notifications_category ON user_notifications (category);

CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_notifications_campaign_id ON user_notifications (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON admin_notification_campaigns (status);

CREATE INDEX IF NOT EXISTS idx_campaigns_schedule_at ON admin_notification_campaigns (schedule_at);

CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON admin_notification_campaigns (created_by);

CREATE INDEX IF NOT EXISTS idx_campaign_targets_campaign_id ON admin_notification_targets (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_targets_user_id ON admin_notification_targets (user_id);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON user_fcm_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_is_active ON user_fcm_tokens (is_active);

CREATE INDEX IF NOT EXISTS idx_delivery_log_notification_id ON notification_delivery_log (notification_id);

CREATE INDEX IF NOT EXISTS idx_delivery_log_user_id ON notification_delivery_log (user_id);

CREATE INDEX IF NOT EXISTS idx_delivery_log_status ON notification_delivery_log (status);

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user_id ON user_notification_preferences (user_id);

-- ==========================================
-- Triggers
-- ==========================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to referrals table
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON admin_notification_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_prefs_updated_at
    BEFORE UPDATE ON user_notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
-- ==========================================
-- Success Notification
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '   Core tables: users, wallets, referrals, notifications';
    RAISE NOTICE '   Status: All constraints, indexes & triggers applied';
END $$;