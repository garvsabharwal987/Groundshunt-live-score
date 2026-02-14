-- Insert all sports from the events poster
INSERT INTO sports (name, slug, icon, is_active) VALUES
-- Team Sports
('Football', 'football', '⚽', true),
('Cricket', 'cricket', '🏏', true),
('Volleyball', 'volleyball', '🏐', true),
('Basketball', 'basketball', '🏀', true),
('Badminton', 'badminton', '🏸', true),
('Pickleball', 'pickleball', '🏓', true),
('Kabaddi', 'kabaddi', '🤸', true),
('Tennis', 'tennis', '🎾', true),

-- Individual Sports
('Squash', 'squash', '🎾', true),
('Taekwondo', 'taekwondo', '🥋', true),
('Athletics', 'athletics', '🏃', true),
('Table Tennis', 'table-tennis', '🏓', true),
('Swimming', 'swimming', '🏊', true),
('Long Jump', 'long-jump', '🦘', true),

-- Strength & Field Events
('Powerlifting', 'powerlifting', '🏋️', true),
('Discus Throw', 'discus-throw', '🥏', true),
('Shot Put', 'shot-put', '🥊', true),

-- Mind Sports
('Chess', 'chess', '♟️', true),
('Pool & Snooker', 'pool-snooker', '🎱', true)
ON CONFLICT (name) DO NOTHING;
