-- Check if Badminton sport exists
SELECT id, name, slug FROM sports WHERE name = 'Badminton' OR slug = 'badminton';

-- Check how many fixtures exist for Badminton
SELECT COUNT(*) as total_fixtures FROM fixtures f
JOIN sports s ON f.sport_id = s.id
WHERE s.name = 'Badminton' OR s.slug = 'badminton';

-- Check all fixtures with their sports
SELECT f.id, f.match_date, f.match_time, f.table_number, s.name as sport_name, f.status
FROM fixtures f
JOIN sports s ON f.sport_id = s.id
ORDER BY s.name, f.match_date, f.match_time
LIMIT 20;
