-- ============================================
-- SPORTIKON Arena Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SPORTS TABLE
-- ============================================
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    scoring_format JSONB NOT NULL DEFAULT '{}',
    -- e.g., {"type": "tabletennis", "fields": ["set1", "set2", "set3", "sets_won"]}
    points_config JSONB NOT NULL DEFAULT '{"win": 2, "loss": 0, "draw": 1, "tie": 1}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. TEAMS TABLE
-- ============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    logo_url TEXT,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    color_primary VARCHAR(7) DEFAULT '#000000',
    color_secondary VARCHAR(7) DEFAULT '#FFFFFF',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, sport_id)
);

-- ============================================
-- 3. VENUES TABLE
-- ============================================
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(50),
    location VARCHAR(200),
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. FIXTURES TABLE
-- ============================================
CREATE TYPE match_status AS ENUM ('upcoming', 'live', 'completed', 'cancelled', 'postponed');

CREATE TABLE fixtures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    team_a_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    team_b_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    status match_status DEFAULT 'upcoming',
    round VARCHAR(50), -- e.g., "Quarter Final", "Group Stage"
    match_number INTEGER,
    winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    is_draw BOOLEAN DEFAULT false,
    summary TEXT, -- Brief match summary
    enable_live_scoring BOOLEAN DEFAULT true, -- Whether to use live scoring or direct results
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT different_teams CHECK (team_a_id != team_b_id)
);

-- ============================================
-- 5. LIVE SCORES TABLE
-- ============================================
CREATE TABLE live_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
    
    -- Team A Score Data (JSONB for flexibility across sports)
    team_a_score JSONB NOT NULL DEFAULT '{}',
    -- Table Tennis: {"set1": 21, "set2": 19, "set3": 0, "current_set": 2, "sets_won": 1}
    -- Football: {"goals": 2, "shots": 8, "possession": 55}
    -- Basketball: {"q1": 25, "q2": 28, "q3": 22, "q4": 0, "total": 75}
    -- Badminton/Volleyball: {"set1": 21, "set2": 15, "set3": 0, "current_set": 2, "sets_won": 1}
    
    -- Team B Score Data
    team_b_score JSONB NOT NULL DEFAULT '{}',
    
    -- Match Progress
    current_period VARCHAR(50), -- "1st Innings", "2nd Half", "Q3", "Set 2"
    elapsed_time VARCHAR(20), -- "45:00", "15.3 overs"
    
    -- Additional match info
    match_info JSONB DEFAULT '{}', -- Toss, batting first, etc.
    last_event TEXT, -- "Wicket! Smith caught by Jones"
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    
    CONSTRAINT one_score_per_fixture UNIQUE(fixture_id)
);

-- ============================================
-- 6. POINTS TABLE
-- ============================================
CREATE TABLE points_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    tied INTEGER DEFAULT 0,
    
    points INTEGER DEFAULT 0,
    
    -- Sport-specific stats
    stats JSONB DEFAULT '{}',
    -- Table Tennis: {"sets_for": 150, "sets_against": 120}
    -- Football: {"goals_for": 15, "goals_against": 8, "gd": 7}
    -- Basketball: {"points_for": 500, "points_against": 450, "pd": 50}
    
    -- Net Run Rate / Goal Difference for tie-breaking
    net_rating DECIMAL(10,4) DEFAULT 0,
    
    -- For tournament grouping
    group_name VARCHAR(20),
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(sport_id, team_id, group_name)
);

-- ============================================
-- 7. NEWS OF THE DAY TABLE
-- ============================================
CREATE TABLE news_of_the_day (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    
    -- Highlights & Featured Content
    highlights JSONB DEFAULT '[]',
    -- [{"type": "performance", "text": "Player X scored 100 runs"}, ...]
    
    notable_performances JSONB DEFAULT '[]',
    -- [{"player": "John Doe", "team": "Team A", "achievement": "Hat-trick"}]
    
    -- Media
    featured_image_url TEXT,
    
    -- Publishing
    publish_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    
    -- Author info
    created_by UUID,
    updated_by UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_daily_news UNIQUE(publish_date)
);

-- ============================================
-- 8. USERS TABLE (Admin/Moderators)
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'viewer');

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'publish'
    entity_type VARCHAR(50) NOT NULL, -- 'fixture', 'live_score', 'team', etc.
    entity_id UUID,
    
    old_data JSONB,
    new_data JSONB,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. ANNOUNCEMENTS TABLE (Optional)
-- ============================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'urgent'
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Fixtures indexes
CREATE INDEX idx_fixtures_sport ON fixtures(sport_id);
CREATE INDEX idx_fixtures_date ON fixtures(match_date);
CREATE INDEX idx_fixtures_status ON fixtures(status);
CREATE INDEX idx_fixtures_teams ON fixtures(team_a_id, team_b_id);

-- Live scores index
CREATE INDEX idx_live_scores_fixture ON live_scores(fixture_id);
CREATE INDEX idx_live_scores_updated ON live_scores(updated_at);

-- Points table indexes
CREATE INDEX idx_points_sport ON points_table(sport_id);
CREATE INDEX idx_points_team ON points_table(team_id);
CREATE INDEX idx_points_ranking ON points_table(sport_id, points DESC, net_rating DESC);

-- Teams index
CREATE INDEX idx_teams_sport ON teams(sport_id);

-- News index
CREATE INDEX idx_news_date ON news_of_the_day(publish_date DESC);
CREATE INDEX idx_news_published ON news_of_the_day(is_published, publish_date);

-- Audit logs index
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_of_the_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (User Portal)
-- ============================================

-- Anyone can read sports
CREATE POLICY "Public read sports" ON sports
    FOR SELECT USING (is_active = true);

-- Anyone can read teams
CREATE POLICY "Public read teams" ON teams
    FOR SELECT USING (is_active = true);

-- Anyone can read venues
CREATE POLICY "Public read venues" ON venues
    FOR SELECT USING (is_active = true);

-- Anyone can read fixtures
CREATE POLICY "Public read fixtures" ON fixtures
    FOR SELECT USING (true);

-- Anyone can read live scores
CREATE POLICY "Public read live_scores" ON live_scores
    FOR SELECT USING (true);

-- Anyone can read points table
CREATE POLICY "Public read points_table" ON points_table
    FOR SELECT USING (true);

-- Anyone can read published news
CREATE POLICY "Public read published news" ON news_of_the_day
    FOR SELECT USING (is_published = true);

-- Anyone can read active announcements
CREATE POLICY "Public read announcements" ON announcements
    FOR SELECT USING (is_active = true);

-- ============================================
-- ADMIN WRITE POLICIES
-- ============================================

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
    SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin/Moderator can manage sports
CREATE POLICY "Admin manage sports" ON sports
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage teams
CREATE POLICY "Admin manage teams" ON teams
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage venues
CREATE POLICY "Admin manage venues" ON venues
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage fixtures
CREATE POLICY "Admin manage fixtures" ON fixtures
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage live scores
CREATE POLICY "Admin manage live_scores" ON live_scores
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage points table
CREATE POLICY "Admin manage points_table" ON points_table
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Admin/Moderator can manage news
CREATE POLICY "Admin manage news" ON news_of_the_day
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- Only admin can manage users
CREATE POLICY "Admin manage users" ON users
    FOR ALL USING (auth.user_role() = 'admin')
    WITH CHECK (auth.user_role() = 'admin');

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Admin can read audit logs
CREATE POLICY "Admin read audit_logs" ON audit_logs
    FOR SELECT USING (auth.user_role() IN ('admin', 'moderator'));

-- System can insert audit logs
CREATE POLICY "System insert audit_logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Admin can manage announcements
CREATE POLICY "Admin manage announcements" ON announcements
    FOR ALL USING (auth.user_role() IN ('admin', 'moderator'))
    WITH CHECK (auth.user_role() IN ('admin', 'moderator'));

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_sports_updated_at
    BEFORE UPDATE ON sports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_fixtures_updated_at
    BEFORE UPDATE ON fixtures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_live_scores_updated_at
    BEFORE UPDATE ON live_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_points_table_updated_at
    BEFORE UPDATE ON points_table
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news_of_the_day
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for live scores (critical for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE live_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE fixtures;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

-- ============================================
-- SEED DATA - SPORTS
-- ============================================

INSERT INTO sports (name, slug, icon, scoring_format, points_config) VALUES
('Table Tennis', 'tabletennis', 'paddle', 
 '{"fields": ["set1", "set2", "set3", "sets_won"], "periods": ["Set 1", "Set 2", "Set 3"]}',
 '{"win": 2, "loss": 0}'),

('Football', 'football', 'goal', 
 '{"fields": ["goals", "shots", "possession", "fouls"], "periods": ["1st Half", "2nd Half", "Extra Time", "Penalties"]}',
 '{"win": 3, "loss": 0, "draw": 1}'),

('Basketball', 'basketball', 'basketball', 
 '{"fields": ["q1", "q2", "q3", "q4", "ot", "total"], "periods": ["Q1", "Q2", "Q3", "Q4", "OT"]}',
 '{"win": 2, "loss": 0}'),

('Badminton', 'badminton', 'feather', 
 '{"fields": ["set1", "set2", "set3", "sets_won"], "periods": ["Set 1", "Set 2", "Set 3"], "max_sets": 3}',
 '{"win": 2, "loss": 0}'),

('Volleyball', 'volleyball', 'volleyball', 
 '{"fields": ["set1", "set2", "set3", "set4", "set5", "sets_won"], "periods": ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"], "max_sets": 5}',
 '{"win": 2, "loss": 0}');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate points after match completion
CREATE OR REPLACE FUNCTION calculate_match_points()
RETURNS TRIGGER AS $$
DECLARE
    sport_config JSONB;
    win_points INTEGER;
    loss_points INTEGER;
    draw_points INTEGER;
BEGIN
    -- Only process when match is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Get sport points configuration
        SELECT points_config INTO sport_config FROM sports WHERE id = NEW.sport_id;
        
        win_points := COALESCE((sport_config->>'win')::INTEGER, 2);
        loss_points := COALESCE((sport_config->>'loss')::INTEGER, 0);
        draw_points := COALESCE((sport_config->>'draw')::INTEGER, 1);
        
        IF NEW.is_draw THEN
            -- Update both teams for draw
            UPDATE points_table 
            SET played = played + 1, drawn = drawn + 1, points = points + draw_points
            WHERE team_id IN (NEW.team_a_id, NEW.team_b_id) AND sport_id = NEW.sport_id;
        ELSIF NEW.winner_id IS NOT NULL THEN
            -- Update winner
            UPDATE points_table 
            SET played = played + 1, won = won + 1, points = points + win_points
            WHERE team_id = NEW.winner_id AND sport_id = NEW.sport_id;
            
            -- Update loser
            UPDATE points_table 
            SET played = played + 1, lost = lost + 1, points = points + loss_points
            WHERE team_id = CASE WHEN NEW.winner_id = NEW.team_a_id THEN NEW.team_b_id ELSE NEW.team_a_id END
            AND sport_id = NEW.sport_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_points
    AFTER UPDATE ON fixtures
    FOR EACH ROW EXECUTE FUNCTION calculate_match_points();

-- Function to create live_score entry when fixture is created
CREATE OR REPLACE FUNCTION create_live_score_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO live_scores (fixture_id, team_a_score, team_b_score)
    VALUES (NEW.id, '{}', '{}')
    ON CONFLICT (fixture_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_live_score
    AFTER INSERT ON fixtures
    FOR EACH ROW EXECUTE FUNCTION create_live_score_entry();

-- Function to initialize points table entry for new team
CREATE OR REPLACE FUNCTION initialize_team_points()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO points_table (sport_id, team_id, played, won, lost, drawn, points)
    VALUES (NEW.sport_id, NEW.id, 0, 0, 0, 0, 0)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_init_team_points
    AFTER INSERT ON teams
    FOR EACH ROW EXECUTE FUNCTION initialize_team_points();
