-- Insert all sports with gender classification
INSERT INTO sports (name, slug, icon, is_active) VALUES
-- Tennis
('Tennis (Boys)', 'tennis-boys', '🎾', true),
('Tennis (Girls)', 'tennis-girls', '🎾', true),

-- Table Tennis
('Table Tennis (Boys)', 'table-tennis-boys', '🏓', true),
('Table Tennis (Girls)', 'table-tennis-girls', '🏓', true),

-- Basketball
('Basketball (Boys)', 'basketball-boys', '🏀', true),
('Basketball (Girls)', 'basketball-girls', '🏀', true),

-- Volleyball
('Volleyball (Boys)', 'volleyball-boys', '🏐', true),
('Volleyball (Girls)', 'volleyball-girls', '🏐', true),

-- Other Sports
('Kabaddi', 'kabaddi', '🤸', true),
('Football', 'football', '⚽', true),
('Cricket', 'cricket', '🏏', true),

-- Additional Sports (for future use)
('Badminton (Boys)', 'badminton-boys', '🏸', true),
('Badminton (Girls)', 'badminton-girls', '🏸', true),
('Squash (Boys)', 'squash-boys', '🎾', true),
('Squash (Girls)', 'squash-girls', '🎾', true),
('Taekwondo (Boys)', 'taekwondo-boys', '🥋', true),
('Taekwondo (Girls)', 'taekwondo-girls', '🥋', true),
('Athletics (Boys)', 'athletics-boys', '🏃', true),
('Athletics (Girls)', 'athletics-girls', '🏃', true),
('Swimming (Boys)', 'swimming-boys', '🏊', true),
('Swimming (Girls)', 'swimming-girls', '🏊', true),
('Chess (Open)', 'chess-open', '♟️', true),
('Pickleball (Boys)', 'pickleball-boys', '🏓', true),
('Pickleball (Girls)', 'pickleball-girls', '🏓', true),
('Powerlifting (Boys)', 'powerlifting-boys', '🏋️', true),
('Powerlifting (Girls)', 'powerlifting-girls', '🏋️', true)
ON CONFLICT (name) DO NOTHING;
