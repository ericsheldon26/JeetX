-- Leaderboard Points Table (stores aggregated points per period)
CREATE TABLE IF NOT EXISTS leaderboard_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id UUID REFERENCES games (id),
    period_type VARCHAR(20) NOT NULL CHECK (
        period_type IN (
            'DAILY',
            'WEEKLY',
            'MONTHLY',
            'ALL_TIME'
        )
    ),
    points INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        user_id,
        game_id,
        period_type,
        period_start
    )
);

-- Leaderboard Rankings Cache (pre-calculated rankings)
CREATE TABLE IF NOT EXISTS leaderboard_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id UUID REFERENCES games (id),
    period_type VARCHAR(20) NOT NULL CHECK (
        period_type IN (
            'DAILY',
            'WEEKLY',
            'MONTHLY',
            'ALL_TIME'
        )
    ),
    rank INTEGER NOT NULL,
    points INTEGER NOT NULL,
    wins INTEGER DEFAULT 0,
    total_prize_won DECIMAL(10, 2) DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        user_id,
        game_id,
        period_type,
        period_start
    )
);

-- Match Results Table (source of truth for points)
CREATE TABLE IF NOT EXISTS match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id UUID REFERENCES games (id),
    match_type VARCHAR(50) NOT NULL CHECK (
        match_type IN (
            'TOURNAMENT',
            'PRACTICE',
            'QUIZ',
            'GAME'
        )
    ),
    match_id UUID, -- References tournament_slot, quiz_session, etc.
    points_earned INTEGER DEFAULT 0,
    coins_won INTEGER DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    rank INTEGER,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_points_user ON leaderboard_points (user_id);

CREATE INDEX IF NOT EXISTS idx_leaderboard_points_period ON leaderboard_points (
    period_type,
    period_start,
    period_end
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_points_category ON leaderboard_points (game_id);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rankings_period ON leaderboard_rankings (
    period_type,
    period_start,
    period_end
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rankings_rank ON leaderboard_rankings (rank);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rankings_category ON leaderboard_rankings (game_id);

CREATE INDEX IF NOT EXISTS idx_match_results_user ON match_results (user_id);

CREATE INDEX IF NOT EXISTS idx_match_results_played_at ON match_results (played_at);

CREATE INDEX IF NOT EXISTS idx_match_results_category ON match_results (game_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_points_lookup ON leaderboard_points (
    period_type,
    period_start,
    game_id,
    points DESC
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rankings_lookup ON leaderboard_rankings (
    period_type,
    period_start,
    game_id,
    rank
);