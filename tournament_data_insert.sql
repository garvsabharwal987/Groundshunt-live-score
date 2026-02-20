-- ============================================
-- SPORTIKON FRESH TOURNAMENT DATA INSERT
-- Adding Sports, Teams, and Fixtures
-- ============================================

-- ============================================
-- 1. INSERT TEAMS FOR VOLLEYBALL (GIRLS)
-- ============================================
-- Get sport_id for Volleyball (Girls)
-- Teams: MATA SUNDARI, BENNETT B, ASHOKA, OP JINDAL, GARGI, MODY, SRM, IILM, BENNETT A, SHARDA

INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'MATA SUNDARI', 'MATA', id, 'Mata Sundari College' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'ASHOKA', 'ASHOKA', id, 'Ashoka University' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'OP JINDAL', 'OP JINDAL', id, 'O.P. Jindal Global University' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'GARGI', 'GARGI', id, 'Gargi College' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'MODY', 'MODY', id, 'Modyul College' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'SRM', 'SRM', id, 'SRM Institute of Science and Technology' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'IILM', 'IILM', id, 'IILM University' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'BENNETT A', 'BENNETT A', id, 'Bennett University A' FROM sports WHERE name = 'Volleyball (Girls)'
UNION ALL
SELECT 'SHARDA', 'SHARDA', id, 'Sharda University' FROM sports WHERE name = 'Volleyball (Girls)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 2. INSERT TEAMS FOR BADMINTON (BOYS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'SNU', 'SNU', id, 'Shiv Nadar University' FROM sports WHERE name = 'Badminton (Boys)'
UNION ALL
SELECT 'GALGOTIAS', 'GALGOTIAS', id, 'Galgotias University' FROM sports WHERE name = 'Badminton (Boys)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 3. INSERT TEAMS FOR TABLE TENNIS (BOYS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'SNU', 'SNU', id, 'Shiv Nadar University' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'BMU', 'BMU', id, 'Bijnor Medical University' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'OP JINDAL', 'OP JINDAL', id, 'O.P. Jindal Global University' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'ASHOKA', 'ASHOKA', id, 'Ashoka University' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'HANSRAJ', 'HANSRAJ', id, 'Hansraj College' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'IMI', 'IMI', id, 'Institute of Management and Innovation' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'GURU GOBIND', 'GURU GOBIND', id, 'Guru Gobind Singh College' FROM sports WHERE name = 'Table Tennis (Boys)'
UNION ALL
SELECT 'DTU', 'DTU', id, 'Delhi Technological University' FROM sports WHERE name = 'Table Tennis (Boys)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 4. INSERT TEAMS FOR TENNIS (BOYS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'ASHOKA', 'ASHOKA', id, 'Ashoka University' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'AMITY', 'AMITY', id, 'Amity University' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'SNU', 'SNU', id, 'Shiv Nadar University' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'BENNETT A', 'BENNETT A', id, 'Bennett University A' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'MUNJYAL', 'MUNJYAL', id, 'Munjyal Institute' FROM sports WHERE name = 'Tennis (Boys)'
UNION ALL
SELECT 'OP JINDAL', 'OP JINDAL', id, 'O.P. Jindal Global University' FROM sports WHERE name = 'Tennis (Boys)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 5. INSERT TEAMS FOR TENNIS (GIRLS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'BENNETT', 'BENNETT', id, 'Bennett University' FROM sports WHERE name = 'Tennis (Girls)'
UNION ALL
SELECT 'MUNJYAL', 'MUNJYAL', id, 'Munjyal Institute' FROM sports WHERE name = 'Tennis (Girls)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 6. INSERT TEAMS FOR BASKETBALL (BOYS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'ASHOKA', 'ASHOKA', id, 'Ashoka University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'SRM', 'SRM', id, 'SRM Institute of Science and Technology' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'MOTILAL', 'MOTILAL', id, 'Motilal Nehru College' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'JIIT', 'JIIT', id, 'Jaypee Institute of Information Technology' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'ALUMNI', 'ALUMNI', id, 'Alumni Team' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'SHUBHARTI', 'SHUBHARTI', id, 'Shobhit University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'HANSRAJ', 'HANSRAJ', id, 'Hansraj College' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'DBS', 'DBS', id, 'Delhi Business School' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'BENNETT', 'BENNETT', id, 'Bennett University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'SNU', 'SNU', id, 'Shiv Nadar University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'KMC', 'KMC', id, 'KMC Institute' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'BRAC', 'BRAC', id, 'BRAC Institute' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'OP JINDAL', 'OP JINDAL', id, 'O.P. Jindal Global University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'GALGOTIAS', 'GALGOTIAS', id, 'Galgotias University' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'VIPS', 'VIPS', id, 'VIPS Institute' FROM sports WHERE name = 'Basketball (Boys)'
UNION ALL
SELECT 'BENNETT A', 'BENNETT A', id, 'Bennett University A' FROM sports WHERE name = 'Basketball (Boys)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 7. INSERT TEAMS FOR SQUASH
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'JINDAL A', 'JINDAL A', id, 'O.P. Jindal Global University A' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'JINDAL B', 'JINDAL B', id, 'O.P. Jindal Global University B' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'BENNETT A', 'BENNETT A', id, 'Bennett University A' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'SNU', 'SNU', id, 'Shiv Nadar University' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'ASHOKA', 'ASHOKA', id, 'Ashoka University' FROM sports WHERE name = 'Squash'
UNION ALL
SELECT 'AMITY', 'AMITY', id, 'Amity University' FROM sports WHERE name = 'Squash'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 8. INSERT TEAMS FOR VOLLEYBALL (BOYS)
-- ============================================
INSERT INTO teams (name, short_name, sport_id, college_name)
SELECT 'OP JINDAL', 'OP JINDAL', id, 'O.P. Jindal Global University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'IILM', 'IILM', id, 'IILM University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'NIU', 'NIU', id, 'National Institute of University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'SHARDA', 'SHARDA', id, 'Sharda University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'GL BAJAJ', 'GL BAJAJ', id, 'GL Bajaj Institute' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'PGDAV', 'PGDAV', id, 'P.G.D.A.V. College' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'MANAV R', 'MANAV R', id, 'Manav Rachna University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'KUMOUN', 'KUMOUN', id, 'Kumoun University' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'BENNETT B', 'BENNETT B', id, 'Bennett University B' FROM sports WHERE name = 'Volleyball (Boys)'
UNION ALL
SELECT 'BENNETT A', 'BENNETT A', id, 'Bennett University A' FROM sports WHERE name = 'Volleyball (Boys)'
ON CONFLICT (sport_id, name) DO NOTHING;

-- ============================================
-- 9. INSERT FIXTURES - VOLLEYBALL (GIRLS)
-- ============================================
-- 19-2-2026
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MATA SUNDARI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_b,
  '2026-02-19'::DATE, '09:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GARGI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MODY') as team_b,
  '2026-02-19'::DATE, '10:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GARGI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SRM') as team_b,
  '2026-02-19'::DATE, '11:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GARGI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'IILM') as team_b,
  '2026-02-19'::DATE, '12:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GARGI') as team_b,
  '2026-02-19'::DATE, '16:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MATA SUNDARI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SHARDA') as team_b,
  '2026-02-19'::DATE, '17:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

-- 20-2-2026
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MATA SUNDARI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-20'::DATE, '18:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MATA SUNDARI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_b,
  '2026-02-20'::DATE, '19:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Girls)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. INSERT FIXTURES - BADMINTON (BOYS) - 20-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GALGOTIAS') as team_b,
  '2026-02-20'::DATE, '17:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Badminton (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. INSERT FIXTURES - TABLE TENNIS (BOYS) - 20-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BMU') as team_b,
  '2026-02-20'::DATE, '11:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_b,
  '2026-02-20'::DATE, '11:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'HANSRAJ') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-20'::DATE, '12:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'IMI') as team_b,
  '2026-02-20'::DATE, '12:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GURU GOBIND') as team_b,
  '2026-02-20'::DATE, '13:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'HANSRAJ') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'DTU') as team_b,
  '2026-02-20'::DATE, '13:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Table Tennis (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 12. INSERT FIXTURES - TENNIS (BOYS) - 19-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'AMITY') as team_b,
  '2026-02-19'::DATE, '09:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-19'::DATE, '11:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-19'::DATE, '15:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MUNJYAL') as team_b,
  '2026-02-19'::DATE, '18:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_b,
  '2026-02-19'::DATE, '09:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_b,
  '2026-02-19'::DATE, '12:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'AMITY') as team_b,
  '2026-02-19'::DATE, '14:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_b,
  '2026-02-19'::DATE, '17:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 13. INSERT FIXTURES - TENNIS (GIRLS) - 20-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MUNJYAL') as team_b,
  '2026-02-20'::DATE, '19:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Tennis (Girls)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. INSERT FIXTURES - BASKETBALL (BOYS) - 20-2-2026 (First Set)
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SRM') as team_b,
  '2026-02-20'::DATE, '09:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MOTILAL') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JIIT') as team_b,
  '2026-02-20'::DATE, '09:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ALUMNI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SHUBHARTI') as team_b,
  '2026-02-20'::DATE, '10:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'HANSRAJ') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'DBS') as team_b,
  '2026-02-20'::DATE, '11:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SRM') as team_b,
  '2026-02-20'::DATE, '12:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MOTILAL') as team_b,
  '2026-02-20'::DATE, '13:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 15. INSERT FIXTURES - BASKETBALL (BOYS) - 20-2-2026 (Second Set)
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'KMC') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BRAC') as team_b,
  '2026-02-20'::DATE, '14:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SHUBHARTI') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-20'::DATE, '14:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JIIT') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_b,
  '2026-02-20'::DATE, '15:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GALGOTIAS') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'VIPS') as team_b,
  '2026-02-20'::DATE, '16:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ALUMNI') as team_b,
  '2026-02-20'::DATE, '17:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_b,
  '2026-02-20'::DATE, '18:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Basketball (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- 16. INSERT FIXTURES - SQUASH (First Set) - 20-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-20'::DATE, '15:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_b,
  '2026-02-20'::DATE, '17:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_b,
  '2026-02-20'::DATE, '17:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL B') as team_b,
  '2026-02-20'::DATE, '17:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

-- ============================================
-- 17. INSERT FIXTURES - SQUASH (Second Set) - 20-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_b,
  '2026-02-20'::DATE, '09:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL B') as team_b,
  '2026-02-20'::DATE, '09:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_b,
  '2026-02-20'::DATE, '12:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'AMITY') as team_b,
  '2026-02-20'::DATE, '12:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SNU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'ASHOKA') as team_b,
  '2026-02-20'::DATE, '15:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'JINDAL B') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'AMITY') as team_b,
  '2026-02-20'::DATE, '15:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Squash'
ON CONFLICT DO NOTHING;

-- ============================================
-- 18. INSERT FIXTURES - VOLLEYBALL (BOYS) - 19-2-2026
-- ============================================
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'IILM') as team_b,
  '2026-02-19'::DATE, '10:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'NIU') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SHARDA') as team_b,
  '2026-02-19'::DATE, '11:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GL BAJAJ') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'PGDAV') as team_b,
  '2026-02-19'::DATE, '13:00'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'OP JINDAL') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GL BAJAJ') as team_b,
  '2026-02-19'::DATE, '14:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MANAV R') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'NIU') as team_b,
  '2026-02-19'::DATE, '15:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'SHARDA') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'KUMOUN') as team_b,
  '2026-02-19'::DATE, '16:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT B') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'MANAV R') as team_b,
  '2026-02-19'::DATE, '17:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'BENNETT A') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'GL BAJAJ') as team_b,
  '2026-02-19'::DATE, '18:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

INSERT INTO fixtures (sport_id, team_a_id, team_b_id, match_date, match_time, status)
SELECT s.id,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'PGDAV') as team_a,
  (SELECT id FROM teams WHERE sport_id = s.id AND name = 'IILM') as team_b,
  '2026-02-19'::DATE, '19:30'::TIME, 'upcoming'
FROM sports s WHERE s.name = 'Volleyball (Boys)'
ON CONFLICT DO NOTHING;

-- ============================================
-- Data insertion complete!
-- Run this SQL file in your Supabase SQL editor
-- ============================================
