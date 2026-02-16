-- SPORTIKON Arena Schema for Supabase
-- Execute this SQL in Supabase SQL editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sports table
CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  color_primary TEXT DEFAULT '#000000',
  color_secondary TEXT DEFAULT '#FFFFFF',
  logo_url TEXT,
  college_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sport_id, name)
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  team_a_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  team_b_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled', 'postponed')),
  round TEXT,
  match_number INTEGER,
  winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  is_draw BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live scores table
CREATE TABLE IF NOT EXISTS live_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fixture_id UUID UNIQUE NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  team_a_score JSONB DEFAULT '{}',
  team_b_score JSONB DEFAULT '{}',
  current_period TEXT DEFAULT '1st',
  elapsed_time TEXT DEFAULT '0',
  last_event TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points table (standings)
CREATE TABLE IF NOT EXISTS points_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  group_name TEXT,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  net_run_rate REAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sport_id, team_id)
);

-- News of the day table
CREATE TABLE IF NOT EXISTS news_of_the_day (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fixtures_sport ON fixtures(sport_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_team_a ON fixtures(team_a_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_team_b ON fixtures(team_b_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
CREATE INDEX IF NOT EXISTS idx_fixtures_match_date ON fixtures(match_date);
CREATE INDEX IF NOT EXISTS idx_live_scores_fixture ON live_scores(fixture_id);
CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport_id);
CREATE INDEX IF NOT EXISTS idx_points_table_sport ON points_table(sport_id);
CREATE INDEX IF NOT EXISTS idx_news_sport ON news_of_the_day(sport_id);

-- Insert sample sports data
INSERT INTO sports (name, slug, icon, is_active) 
VALUES 
  ('Table Tennis', 'table-tennis', '🏓', true),
  ('Football', 'football', '⚽', true),
  ('Basketball', 'basketball', '🏀', true),
  ('Badminton', 'badminton', '🏸', true),
  ('Volleyball', 'volleyball', '🏐', true),
  ('Cricket', 'cricket', '🏏', true),
  ('Pickleball', 'pickleball', '🏓', true),
  ('Kabaddi', 'kabaddi', '🤸', true),
  ('Tennis', 'tennis', '🎾', true),
  ('Squash', 'squash', '🎾', true),
  ('Taekwondo', 'taekwondo', '🥋', true),
  ('Athletics', 'athletics', '🏃', true),
  ('Swimming', 'swimming', '🏊', true),
  ('Long Jump', 'long-jump', '🦘', true),
  ('Powerlifting', 'powerlifting', '🏋️', true),
  ('Discus Throw', 'discus-throw', '🥏', true),
  ('Shot Put', 'shot-put', '🥊', true),
  ('Chess', 'chess', '♟️', true),
  ('Pool & Snooker', 'pool-snooker', '🎱', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample teams data
INSERT INTO teams (name, short_name, sport_id, primary_color, secondary_color)
SELECT 
  'CSE Warriors', 'CSE', id, '#FF6B6B', '#FFFFFF'
FROM sports WHERE slug = 'tabletennis'
UNION ALL
SELECT 
  'ECE Titans', 'ECE', id, '#4ECDC4', '#FFFFFF'
FROM sports WHERE slug = 'tabletennis'
UNION ALL
SELECT 
  'MECH United', 'MECH', id, '#FFD93D', '#000000'
FROM sports WHERE slug = 'football'
UNION ALL
SELECT 
  'CIVIL FC', 'CIVIL', id, '#6BCB77', '#FFFFFF'
FROM sports WHERE slug = 'football'
ON CONFLICT (sport_id, name) DO NOTHING;

-- Insert sample venues
INSERT INTO venues (name, location, capacity)
VALUES 
  ('Main Stadium', 'Main Campus', 5000),
  ('Indoor Arena', 'Sports Complex', 2000),
  ('Convention Hall', 'Academic Block', 1000)
ON CONFLICT (name) DO NOTHING;

-- Insert sample fixtures
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, venue_id, match_date, match_time, status, round, match_number)
SELECT 
  sports.id,
  (SELECT id FROM teams WHERE name = 'CSE Warriors' LIMIT 1),
  (SELECT id FROM teams WHERE name = 'ECE Titans' LIMIT 1),
  (SELECT id FROM venues WHERE name = 'Main Stadium' LIMIT 1),
  CURRENT_DATE,
  '14:00'::TIME,
  'live',
  '1',
  1
FROM sports WHERE slug = 'tabletennis'
ON CONFLICT DO NOTHING;

-- Insert sample points table
INSERT INTO points_table (sport_id, team_id, played, won, lost, drawn, points, net_run_rate)
SELECT 
  sports.id,
  teams.id,
  5,
  3,
  1,
  1,
  7,
  1.25
FROM sports
CROSS JOIN teams
WHERE sports.id = teams.sport_id
ON CONFLICT (sport_id, team_id) DO NOTHING;
