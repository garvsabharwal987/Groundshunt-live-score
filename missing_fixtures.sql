-- ============================================================================
-- ALL FIXTURES FOR 19-2-2026
-- ============================================================================

-- Step 1: Add all missing teams for each sport
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'VIPS', 'VIPS', id FROM sports WHERE slug = 'badminton-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SNU', 'SNU', id FROM sports WHERE slug = 'badminton-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'ASHOKA', 'ASHOKA', id FROM sports WHERE slug = 'badminton-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'DBS GLOBAL', 'DBS', id FROM sports WHERE slug = 'badminton-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT A', 'BENT A', id FROM sports WHERE slug = 'badminton-boys' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'VENKY', 'VENKY', id FROM sports WHERE slug = 'tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'JIIT', 'JIIT', id FROM sports WHERE slug = 'tennis-boys' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'HANSRAJ', 'HANSRAJ', id FROM sports WHERE slug = 'table-tennis-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BMU', 'BMU', id FROM sports WHERE slug = 'table-tennis-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SNU', 'SNU', id FROM sports WHERE slug = 'table-tennis-girls' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'GURU GOBIND', 'GURU', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'IMI', 'IMI', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'HANSRAJ', 'HANSRAJ', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'DTU', 'DTU', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT A', 'BENT A', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BMU', 'BMU', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT B', 'BENT B', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SNU', 'SNU', id FROM sports WHERE slug = 'table-tennis-boys' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'MOTILAL', 'MOTILAL', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SHUBHARTI', 'SHUBH', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'ALUMNI', 'ALUMNI', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BRAC', 'BRAC', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'GGSIPU', 'GGSIPU', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'RAMJAS', 'RAMJAS', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'VIPS', 'VIPS', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'JAMIYA', 'JAMIYA', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'HANSRAJ', 'HANSRAJ', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'DBS', 'DBS', id FROM sports WHERE slug = 'basketball-boys' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'KUMAUN', 'KUMAUN', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'IILM', 'IILM', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'GL BAJAJ', 'GL BAJAJ', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'MANAV R', 'MANAV', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'NIU', 'NIU', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'PGDAV', 'PGDAV', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT A', 'BENT A', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SHARDA', 'SHARDA', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT B', 'BENT B', id FROM sports WHERE slug = 'volleyball-boys' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'GARGI', 'GARGI', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT A', 'BENT A', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'IILM', 'IILM', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'MATA S.', 'MATA', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'KUMAON', 'KUMAON', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT B', 'BENT B', id FROM sports WHERE slug = 'volleyball-girls' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'MIU', 'MIU', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'DOON GLOBAL', 'DOON', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SHARDA', 'SHARDA', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'ALUMNI', 'ALUMNI', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'SGGSC C', 'SGGSC', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT A', 'BENT A', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'BENNETT B', 'BENT B', id FROM sports WHERE slug = 'football' ON CONFLICT DO NOTHING;

INSERT INTO teams (name, short_name, sport_id) 
SELECT 'UPES', 'UPES', id FROM sports WHERE slug = 'cricket' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'VENKY', 'VENKY', id FROM sports WHERE slug = 'cricket' ON CONFLICT DO NOTHING;
INSERT INTO teams (name, short_name, sport_id) 
SELECT 'MANIPAL', 'MANIPAL', id FROM sports WHERE slug = 'cricket' ON CONFLICT DO NOTHING;

-- Step 2: Clean up duplicates
DELETE FROM fixtures WHERE match_date = '2026-02-19';

-- Step 3: Add all fixtures

-- 🏀 Basketball (Girls)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'basketball-girls'), (SELECT id FROM teams WHERE name = 'MODY' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), (SELECT id FROM teams WHERE name = 'KNC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), '2026-02-19', '14:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'basketball-girls'), (SELECT id FROM teams WHERE name = 'KMC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), (SELECT id FROM teams WHERE name = 'MAITREYI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), '2026-02-19', '15:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'basketball-girls'), (SELECT id FROM teams WHERE name = 'JMC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), (SELECT id FROM teams WHERE name = 'OP JINDAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), '2026-02-19', '17:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'basketball-girls'), (SELECT id FROM teams WHERE name = 'BENNETT' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), '2026-02-19', '18:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'basketball-girls'), (SELECT id FROM teams WHERE name = 'JMC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), (SELECT id FROM teams WHERE name = 'MODY' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-girls')), '2026-02-19', '19:00:00', 'upcoming', 'Group');

-- 🏸 Badminton (Boys)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'badminton-boys'), (SELECT id FROM teams WHERE name = 'OP JINDAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), (SELECT id FROM teams WHERE name = 'VIPS' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), '2026-02-19', '12:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'badminton-boys'), (SELECT id FROM teams WHERE name = 'DBS GLOBAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), '2026-02-19', '12:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'badminton-boys'), (SELECT id FROM teams WHERE name = 'LPU' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), (SELECT id FROM teams WHERE name = 'IGIPESS' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), '2026-02-19', '13:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'badminton-boys'), (SELECT id FROM teams WHERE name = 'BENNETT C' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), (SELECT id FROM teams WHERE name = 'GALGOTIA' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), '2026-02-19', '15:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'badminton-boys'), (SELECT id FROM teams WHERE name = 'BML' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), (SELECT id FROM teams WHERE name = 'IGIPESS' AND sport_id = (SELECT id FROM sports WHERE slug = 'badminton-boys')), '2026-02-19', '17:00:00', 'upcoming', 'Group');

-- 🎾 Tennis (Boys)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'VENKY' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'BENNETT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '10:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'BML' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'JIIT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '12:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'VENKY' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'BML' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '15:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'BENNETT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'JIIT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '17:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'VENKY' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'JIIT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '19:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'tennis-boys'), (SELECT id FROM teams WHERE name = 'BENNETT' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), (SELECT id FROM teams WHERE name = 'AMITY' AND sport_id = (SELECT id FROM sports WHERE slug = 'tennis-boys')), '2026-02-19', '10:00:00', 'upcoming', 'Group');

-- 🏓 Table Tennis (Girls)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'table-tennis-girls'), (SELECT id FROM teams WHERE name = 'OP JINDAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), (SELECT id FROM teams WHERE name = 'BMU' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), '2026-02-19', '12:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-girls'), (SELECT id FROM teams WHERE name = 'HANSRAJ' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), (SELECT id FROM teams WHERE name = 'OP JINDAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), '2026-02-19', '16:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-girls'), (SELECT id FROM teams WHERE name = 'HANSRAJ' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), (SELECT id FROM teams WHERE name = 'BMU' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-girls')), '2026-02-19', '17:00:00', 'upcoming', 'Group');

-- 🏓 Table Tennis (Boys)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'ABES' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '16:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'DTU' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'OP JINDAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '12:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'ABES' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '12:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'BMU' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'GURU GOBIND' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '13:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'IMI' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '13:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'DTU' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'HANSRAJ' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '15:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'table-tennis-boys'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'table-tennis-boys')), '2026-02-19', '15:30:00', 'upcoming', 'Group');

-- 🏐 Volleyball (Boys)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'KUMAUN' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '14:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'IILM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'GL BAJAJ' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '15:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'MANAV R' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'KUMAUN' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '16:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'NIU' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '17:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'IILM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '18:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'MANAV R' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'SHARDA' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '19:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-boys'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), (SELECT id FROM teams WHERE name = 'PGDAV' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-boys')), '2026-02-19', '20:00:00', 'upcoming', 'Group');

-- 🏐 Volleyball (Girls)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'ASHOKA' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'KUMAON' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '12:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'MODY' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '13:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'KUMAON' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '14:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'IILM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'MODY' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '16:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'IILM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '17:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'volleyball-girls'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'volleyball-girls')), '2026-02-19', '19:30:00', 'upcoming', 'Group');

-- ⚽ Football
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'football'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), (SELECT id FROM teams WHERE name = 'MIU' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), '2026-02-19', '16:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'football'), (SELECT id FROM teams WHERE name = 'GALGOTIA' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), (SELECT id FROM teams WHERE name = 'DOON GLOBAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), '2026-02-19', '17:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'football'), (SELECT id FROM teams WHERE name = 'BENNETT A' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), (SELECT id FROM teams WHERE name = 'SHARDA' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), '2026-02-19', '19:00:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'football'), (SELECT id FROM teams WHERE name = 'BENNETT B' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), (SELECT id FROM teams WHERE name = 'ALUMNI' AND sport_id = (SELECT id FROM sports WHERE slug = 'football')), '2026-02-19', '21:00:00', 'upcoming', 'Group');

-- 🏏 Cricket
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status, round) VALUES
((SELECT id FROM sports WHERE slug = 'cricket'), (SELECT id FROM teams WHERE name = 'SNU' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), (SELECT id FROM teams WHERE name = 'IILM' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), '2026-02-19', '07:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'cricket'), (SELECT id FROM teams WHERE name = 'UPES' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), (SELECT id FROM teams WHERE name = 'SRM' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), '2026-02-19', '11:30:00', 'upcoming', 'Group'),
((SELECT id FROM sports WHERE slug = 'cricket'), (SELECT id FROM teams WHERE name = 'VENKY' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), (SELECT id FROM teams WHERE name = 'MANIPAL' AND sport_id = (SELECT id FROM sports WHERE slug = 'cricket')), '2026-02-19', '13:30:00', 'upcoming', 'Group');
