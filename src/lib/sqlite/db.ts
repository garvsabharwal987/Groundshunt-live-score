import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// SQLite database for local testing
const DB_PATH = path.join(process.cwd(), 'local.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = db!;

  // Create tables
  database.exec(`
    -- Sports table
    CREATE TABLE IF NOT EXISTS sports (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Teams table
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      logo_url TEXT,
      primary_color TEXT,
      secondary_color TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Venues table
    CREATE TABLE IF NOT EXISTS venues (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      location TEXT,
      capacity INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Fixtures table
    CREATE TABLE IF NOT EXISTS fixtures (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
      team_a_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      team_b_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      venue_id TEXT REFERENCES venues(id) ON DELETE SET NULL,
      match_date TEXT NOT NULL,
      match_time TEXT,
      status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
      round TEXT,
      match_number INTEGER,
      winner_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
      is_draw INTEGER DEFAULT 0,
      enable_live_scoring INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Live scores table
    CREATE TABLE IF NOT EXISTS live_scores (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      fixture_id TEXT UNIQUE NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
      team_a_score TEXT DEFAULT '{}',
      team_b_score TEXT DEFAULT '{}',
      current_period TEXT DEFAULT '1st',
      elapsed_time TEXT DEFAULT '0',
      last_event TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Points table
    CREATE TABLE IF NOT EXISTS points_table (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
      team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      group_name TEXT,
      played INTEGER DEFAULT 0,
      won INTEGER DEFAULT 0,
      lost INTEGER DEFAULT 0,
      drawn INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      net_run_rate REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(sport_id, team_id)
    );

    -- News table
    CREATE TABLE IF NOT EXISTS news_of_the_day (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      summary TEXT,
      highlights TEXT DEFAULT '[]',
      notable_performances TEXT DEFAULT '[]',
      featured_image_url TEXT,
      publish_date TEXT NOT NULL,
      is_published INTEGER DEFAULT 0,
      published_at TEXT,
      created_by TEXT,
      updated_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT
    );

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'moderator', 'viewer')),
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Audit logs table
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_id TEXT,
      old_data TEXT,
      new_data TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
    CREATE INDEX IF NOT EXISTS idx_fixtures_sport ON fixtures(sport_id);
    CREATE INDEX IF NOT EXISTS idx_fixtures_date ON fixtures(match_date);
    CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport_id);
    CREATE INDEX IF NOT EXISTS idx_live_scores_fixture ON live_scores(fixture_id);
  `);

  // Run migrations - add missing columns
  try {
    database.exec(`ALTER TABLE fixtures ADD COLUMN match_number INTEGER;`);
  } catch {
    // Column already exists, ignore
  }

  try {
    database.exec(`ALTER TABLE fixtures ADD COLUMN enable_live_scoring INTEGER DEFAULT 1;`);
  } catch {
    // Column already exists, ignore
  }

  try {
    database.exec(`ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;`);
  } catch {
    // Column already exists, ignore
  }

  try {
    database.exec(`ALTER TABLE teams ADD COLUMN is_active INTEGER DEFAULT 1;`);
  } catch {
    // Column already exists, ignore
  }

  try {
    database.exec(`ALTER TABLE venues ADD COLUMN is_active INTEGER DEFAULT 1;`);
  } catch {
    // Column already exists, ignore
  }

  // Seed data if sports table is empty
  const count = database.prepare('SELECT COUNT(*) as count FROM sports').get() as { count: number };
  if (count.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  const database = db!;

  // Insert sports
  const insertSport = database.prepare(`
    INSERT INTO sports (id, name, slug, icon) VALUES (?, ?, ?, ?)
  `);

  const sports = [
    { id: 'sport-tabletennis', name: 'Table Tennis', slug: 'tabletennis', icon: '🏓' },
    { id: 'sport-football', name: 'Football', slug: 'football', icon: '⚽' },
    { id: 'sport-basketball', name: 'Basketball', slug: 'basketball', icon: '🏀' },
    { id: 'sport-badminton', name: 'Badminton', slug: 'badminton', icon: '🏸' },
    { id: 'sport-volleyball', name: 'Volleyball', slug: 'volleyball', icon: '🏐' },
  ];

  for (const sport of sports) {
    insertSport.run(sport.id, sport.name, sport.slug, sport.icon);
  }

  // Insert venue
  database.prepare(`
    INSERT INTO venues (id, name, location, capacity) VALUES (?, ?, ?, ?)
  `).run('venue-main', 'Main Stadium', 'Campus Ground', 5000);

  // Insert sample teams
  const insertTeam = database.prepare(`
    INSERT INTO teams (id, sport_id, name, short_name, primary_color, secondary_color) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const teams = [
    { id: 'team-cse', sport: 'sport-tabletennis', name: 'CSE Warriors', short: 'CSE', c1: '#1e40af', c2: '#ffffff' },
    { id: 'team-ece', sport: 'sport-tabletennis', name: 'ECE Titans', short: 'ECE', c1: '#dc2626', c2: '#ffffff' },
    { id: 'team-mech', sport: 'sport-football', name: 'Mech United', short: 'MECH', c1: '#16a34a', c2: '#ffffff' },
    { id: 'team-civil', sport: 'sport-football', name: 'Civil FC', short: 'CIVIL', c1: '#ca8a04', c2: '#000000' },
  ];

  for (const team of teams) {
    insertTeam.run(team.id, team.sport, team.name, team.short, team.c1, team.c2);
  }

  // Insert sample fixtures
  const insertFixture = database.prepare(`
    INSERT INTO fixtures (id, sport_id, team_a_id, team_b_id, venue_id, match_date, match_time, status, round) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFixture.run('fix-1', 'sport-tabletennis', 'team-cse', 'team-ece', 'venue-main', '2026-01-27', '10:00', 'live', 'Semi Final');
  insertFixture.run('fix-2', 'sport-football', 'team-mech', 'team-civil', 'venue-main', '2026-01-27', '15:00', 'live', 'Quarter Final');

  // Insert points table entries
  const insertPoints = database.prepare(`
    INSERT INTO points_table (id, sport_id, team_id, group_name, played, won, lost, drawn, points, net_run_rate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPoints.run('pts-1', 'sport-tabletennis', 'team-cse', 'All Teams', 5, 3, 1, 1, 7, 0.85);
  insertPoints.run('pts-2', 'sport-tabletennis', 'team-ece', 'All Teams', 5, 2, 2, 1, 5, 0.45);
  insertPoints.run('pts-3', 'sport-football', 'team-mech', 'All Teams', 4, 3, 1, 0, 9, 0.75);
  insertPoints.run('pts-4', 'sport-football', 'team-civil', 'All Teams', 4, 2, 2, 0, 6, 0.25);

  // Insert live scores for live matches
  database.prepare(`
    INSERT INTO live_scores (fixture_id, team_a_score, team_b_score, current_period, elapsed_time) VALUES (?, ?, ?, ?, ?)
  `).run('fix-1', JSON.stringify({ set1: 21, set2: 18, sets_won: 1 }), JSON.stringify({ set1: 0, set2: 0, sets_won: 0 }), 'Set 2', '15 mins');

  database.prepare(`
    INSERT INTO live_scores (fixture_id, team_a_score, team_b_score, current_period, elapsed_time) VALUES (?, ?, ?, ?, ?)
  `).run('fix-2', JSON.stringify({ goals: 2 }), JSON.stringify({ goals: 1 }), '2nd Half', '65:00');

  // Insert sample news
  database.prepare(`
    INSERT INTO news_of_the_day (
      id, title, content, summary, highlights, notable_performances, featured_image_url, publish_date, is_published, published_at, created_by, updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'news-1',
    'SPORTIKON 4.0 Kicks Off!',
    'The annual sports festival begins today with exciting matches lined up.',
    'Exciting matches lined up for SPORTIKON 4.0.',
    '[]',
    '[]',
    null,
    new Date().toISOString().slice(0, 10),
    1,
    new Date().toISOString(),
    'admin-1',
    null,
    new Date().toISOString(),
    null
  );

  // Insert admin user
  database.prepare(`
    INSERT INTO users (id, email, full_name, role) VALUES (?, ?, ?, ?)
  `).run('admin-1', 'admin@sportikon.com', 'Admin User', 'super_admin');

  console.log('✅ Database seeded with sample data');
}

// Helper to parse JSON fields
export function parseJSON<T>(str: string | null): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}
