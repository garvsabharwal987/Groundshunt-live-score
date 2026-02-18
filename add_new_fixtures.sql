-- Remove all dummy fixtures
DELETE FROM fixtures;

-- Add Basketball (Boys) fixtures for Pool C (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'OP Jindal'), (SELECT id FROM teams WHERE name = 'Motilal'), '2026-02-19', '10:00', NULL, 'POOL C', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'SNU'), (SELECT id FROM teams WHERE name = 'JIIT'), '2026-02-19', '11:00', NULL, 'POOL C', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Motilal'), (SELECT id FROM teams WHERE name = 'SNU'), '2026-02-19', '12:00', NULL, 'POOL C', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'OP Jindal'), (SELECT id FROM teams WHERE name = 'JIIT'), '2026-02-19', '13:00', NULL, 'POOL C', 'scheduled');

-- Add Basketball (Boys) fixtures for Pool D (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Bennett'), (SELECT id FROM teams WHERE name = 'Ashoka'), '2026-02-19', '10:00', NULL, 'POOL D', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'SRM'), (SELECT id FROM teams WHERE name = 'Bennett'), '2026-02-19', '11:00', NULL, 'POOL D', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Ashoka'), (SELECT id FROM teams WHERE name = 'SRM'), '2026-02-19', '12:00', NULL, 'POOL D', 'scheduled');

-- Add Basketball (Boys) fixtures for Pool E (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Galgotia'), (SELECT id FROM teams WHERE name = 'Ramjas'), '2026-02-19', '10:00', NULL, 'POOL E', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'VIPS'), (SELECT id FROM teams WHERE name = 'Galgotia'), '2026-02-19', '11:00', NULL, 'POOL E', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Ramjas'), (SELECT id FROM teams WHERE name = 'VIPS'), '2026-02-19', '12:00', NULL, 'POOL E', 'scheduled');

-- Add Basketball (Boys) fixtures for Pool F (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Jamiya'), (SELECT id FROM teams WHERE name = 'Hansraj'), '2026-02-19', '10:00', NULL, 'POOL F', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'DBS'), (SELECT id FROM teams WHERE name = 'Jamiya'), '2026-02-19', '11:00', NULL, 'POOL F', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Basketball (Boys)'), (SELECT id FROM teams WHERE name = 'Hansraj'), (SELECT id FROM teams WHERE name = 'DBS'), '2026-02-19', '12:00', NULL, 'POOL F', 'scheduled');

-- Add Volleyball (Boys) fixtures - Pool A (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Kumaun'), (SELECT id FROM teams WHERE name = 'Manav R'), '2026-02-19', '14:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Sharda'), (SELECT id FROM teams WHERE name = 'Kumaun'), '2026-02-19', '15:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'NIU'), (SELECT id FROM teams WHERE name = 'Sharda'), '2026-02-19', '16:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Bennett B'), (SELECT id FROM teams WHERE name = 'NIU'), '2026-02-19', '17:00', NULL, 'POOL A', 'scheduled');

-- Add Volleyball (Boys) fixtures - Pool B (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'OP Jindal'), '2026-02-19', '14:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'IILM'), (SELECT id FROM teams WHERE name = 'Bennett A'), '2026-02-19', '15:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'IILM'), '2026-02-19', '16:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'PGDAV'), (SELECT id FROM teams WHERE name = 'GL Bajaj'), '2026-02-19', '18:00', NULL, 'POOL B', 'scheduled');

-- Add Volleyball (Boys) Day 1 specific fixtures (19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Kumaun'), (SELECT id FROM teams WHERE name = 'Bennett B'), '2026-02-19', '14:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'IILM'), (SELECT id FROM teams WHERE name = 'GL Bajaj'), '2026-02-19', '15:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Manav R'), (SELECT id FROM teams WHERE name = 'Kumaun'), '2026-02-19', '16:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'NIU'), (SELECT id FROM teams WHERE name = 'Bennett B'), '2026-02-19', '17:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'IILM'), '2026-02-19', '18:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Manav R'), (SELECT id FROM teams WHERE name = 'Sharda'), '2026-02-19', '19:00', NULL, 'VB-BOYS-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Boys)'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'PGDAV'), '2026-02-19', '20:00', NULL, 'VB-BOYS-D1', 'scheduled');

-- Add Volleyball (Girls) fixtures - Pool A (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'Gargi'), (SELECT id FROM teams WHERE name = 'Bennett A'), '2026-02-19', '12:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'Mody'), (SELECT id FROM teams WHERE name = 'Gargi'), '2026-02-19', '13:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'IILM'), (SELECT id FROM teams WHERE name = 'Mody'), '2026-02-19', '14:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'SRM'), (SELECT id FROM teams WHERE name = 'IILM'), '2026-02-19', '15:00', NULL, 'POOL A', 'scheduled');

-- Add Volleyball (Girls) fixtures - Pool B (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'Mata S.'), (SELECT id FROM teams WHERE name = 'Ashoka'), '2026-02-19', '12:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'Kumaon'), (SELECT id FROM teams WHERE name = 'Mata S.'), '2026-02-19', '13:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'OP Jindal'), (SELECT id FROM teams WHERE name = 'Kumaon'), '2026-02-19', '14:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Volleyball (Girls)'), (SELECT id FROM teams WHERE name = 'Bennett B'), (SELECT id FROM teams WHERE name = 'OP Jindal'), '2026-02-19', '15:00', NULL, 'POOL B', 'scheduled');

-- Add Kabaddi fixtures (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Kabaddi'), (SELECT id FROM teams WHERE name = 'ZHDC'), (SELECT id FROM teams WHERE name = 'Sharda'), '2026-02-19', '12:00', NULL, 'KABADDI-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Kabaddi'), (SELECT id FROM teams WHERE name = 'Bennett B'), (SELECT id FROM teams WHERE name = 'NIU'), '2026-02-19', '12:40', NULL, 'KABADDI-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Kabaddi'), (SELECT id FROM teams WHERE name = 'Sharda'), (SELECT id FROM teams WHERE name = 'BML'), '2026-02-19', '13:20', NULL, 'KABADDI-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Kabaddi'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'ZHDC'), '2026-02-19', '14:00', NULL, 'KABADDI-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Kabaddi'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'BML'), '2026-02-19', '15:10', NULL, 'KABADDI-D1', 'scheduled');

-- Add Football fixtures - Pool A (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Galgotia'), (SELECT id FROM teams WHERE name = 'SNU'), '2026-02-19', '16:00', NULL, 'POOL A', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Doon'), (SELECT id FROM teams WHERE name = 'Galgotia'), '2026-02-19', '17:00', NULL, 'POOL A', 'scheduled');

-- Add Football fixtures - Pool B (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'Sharda'), '2026-02-19', '16:00', NULL, 'POOL B', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'MIU'), (SELECT id FROM teams WHERE name = 'Bennett A'), '2026-02-19', '17:00', NULL, 'POOL B', 'scheduled');

-- Add Football fixtures - Pool C (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Ashoka'), (SELECT id FROM teams WHERE name = 'Amity'), '2026-02-19', '16:00', NULL, 'POOL C', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'BRAC'), (SELECT id FROM teams WHERE name = 'Ashoka'), '2026-02-19', '17:00', NULL, 'POOL C', 'scheduled');

-- Add Football fixtures - Pool D (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Alumni'), (SELECT id FROM teams WHERE name = 'SGGSCC'), '2026-02-19', '16:00', NULL, 'POOL D', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Bennett B'), (SELECT id FROM teams WHERE name = 'Alumni'), '2026-02-19', '17:00', NULL, 'POOL D', 'scheduled');

-- Add Football Day 1 specific fixtures (19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'MIU'), '2026-02-19', '16:00', NULL, 'FOOTBALL-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Galgotia'), (SELECT id FROM teams WHERE name = 'Doon Global'), '2026-02-19', '17:30', NULL, 'FOOTBALL-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Bennett A'), (SELECT id FROM teams WHERE name = 'Sharda'), '2026-02-19', '19:00', NULL, 'FOOTBALL-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Football'), (SELECT id FROM teams WHERE name = 'Bennett B'), (SELECT id FROM teams WHERE name = 'Alumni'), '2026-02-19', '21:00', NULL, 'FOOTBALL-D1', 'scheduled');

-- Add Cricket fixtures (Day 1: 19-2-2026)
INSERT INTO fixtures (sport_id, team_a_id, team_b_id, scheduled_date, scheduled_time, venue_id, pool, status) VALUES
((SELECT id FROM sports WHERE name = 'Cricket'), (SELECT id FROM teams WHERE name = 'SNU'), (SELECT id FROM teams WHERE name = 'IILM'), '2026-02-19', '07:30', NULL, 'CRICKET-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Cricket'), (SELECT id FROM teams WHERE name = 'UPES'), (SELECT id FROM teams WHERE name = 'SRM'), '2026-02-19', '11:30', NULL, 'CRICKET-D1', 'scheduled'),
((SELECT id FROM sports WHERE name = 'Cricket'), (SELECT id FROM teams WHERE name = 'Venky'), (SELECT id FROM teams WHERE name = 'Manipal'), '2026-02-19', '13:30', NULL, 'CRICKET-D1', 'scheduled');
