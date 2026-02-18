-- Add Tennis (Boys) Teams
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'tennis-boys'), '#1a4d8f', '#FFFFFF'),
('AMITY', 'AMITY', (SELECT id FROM sports WHERE slug = 'tennis-boys'), '#d32f2f', '#FFFFFF'),
('BENNETT', 'BENNETT', (SELECT id FROM sports WHERE slug = 'tennis-boys'), '#f57c00', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Tennis (Girls) Teams
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'tennis-girls'), '#1a4d8f', '#FFFFFF'),
('BMU', 'BMU', (SELECT id FROM sports WHERE slug = 'tennis-girls'), '#00796b', '#FFFFFF'),
('HANSRAJ', 'HANSRAJ', (SELECT id FROM sports WHERE slug = 'tennis-girls'), '#512da8', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Table Tennis (Boys) Teams - Pool A
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('DTU', 'DTU', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#1976d2', '#FFFFFF'),
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#1a4d8f', '#FFFFFF'),
('HANSRAJ', 'HANSRAJ', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#512da8', '#FFFFFF'),
('BENNETT A', 'BENNETT A', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#f57c00', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#f57c00', '#FFFFFF'),
('ABES', 'ABES', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#0097a7', '#FFFFFF'),
('SRM', 'SRM', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#c62828', '#FFFFFF'),
('BMU', 'BMU', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#00796b', '#FFFFFF'),
('GURU GOBIND', 'GURU GOBIND', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#558b2f', '#FFFFFF'),
('IMI', 'IMI', (SELECT id FROM sports WHERE slug = 'table-tennis-boys'), '#6a1b9a', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Table Tennis (Girls) Teams
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'table-tennis-girls'), '#1a4d8f', '#FFFFFF'),
('BMU', 'BMU', (SELECT id FROM sports WHERE slug = 'table-tennis-girls'), '#00796b', '#FFFFFF'),
('HANSRAJ', 'HANSRAJ', (SELECT id FROM sports WHERE slug = 'table-tennis-girls'), '#512da8', '#FFFFFF'),
('SNY', 'SNY', (SELECT id FROM sports WHERE slug = 'table-tennis-girls'), '#c62828', '#FFFFFF'),
('ASHOKA', 'ASHOKA', (SELECT id FROM sports WHERE slug = 'table-tennis-girls'), '#1565c0', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Basketball (Boys) Teams - Pool A
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('SHUBHARTI', 'SHUBHARTI', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#f57c00', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#f57c00', '#FFFFFF'),
('ALUMNI', 'ALUMNI', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#1976d2', '#FFFFFF'),
-- Pool B
('KMC', 'KMC', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#00796b', '#FFFFFF'),
('BRAC', 'BRAC', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#7b1fa2', '#FFFFFF'),
('GGSIPU', 'GGSIPU', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#c62828', '#FFFFFF'),
-- Pool C
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#1a4d8f', '#FFFFFF'),
('MOTILAL', 'MOTILAL', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#455a64', '#FFFFFF'),
('SNU', 'SNU', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#6a1b9a', '#FFFFFF'),
('JIIT', 'JIIT', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#1565c0', '#FFFFFF'),
-- Pool D
('BENNETT', 'BENNETT', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#f57c00', '#FFFFFF'),
('ASHOKA', 'ASHOKA', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#1565c0', '#FFFFFF'),
('SRM', 'SRM', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#c62828', '#FFFFFF'),
-- Pool E
('GALGOTIA', 'GALGOTIA', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#558b2f', '#FFFFFF'),
('RAMJAS', 'RAMJAS', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#d32f2f', '#FFFFFF'),
('VIPS', 'VIPS', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#00695c', '#FFFFFF'),
-- Pool F
('JAMIYA', 'JAMIYA', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#7b1fa2', '#FFFFFF'),
('HANSRAJ', 'HANSRAJ', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#512da8', '#FFFFFF'),
('DBS', 'DBS', (SELECT id FROM sports WHERE slug = 'basketball-boys'), '#1a226b', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Volleyball (Boys) Teams - Pool A
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('KUMAUN', 'KUMAUN', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#1976d2', '#FFFFFF'),
('MANAV R', 'MANAV R', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#f57c00', '#FFFFFF'),
('SHARDA', 'SHARDA', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#00796b', '#FFFFFF'),
('NIU', 'NIU', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#512da8', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#f57c00', '#FFFFFF'),
-- Pool B
('BENNETT A', 'BENNETT A', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#f57c00', '#FFFFFF'),
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#1a4d8f', '#FFFFFF'),
('IILM', 'IILM', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#1565c0', '#FFFFFF'),
('GL BAJAJ', 'GL BAJAJ', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#c62828', '#FFFFFF'),
('PGDAV', 'PGDAV', (SELECT id FROM sports WHERE slug = 'volleyball-boys'), '#558b2f', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Volleyball (Girls) Teams - Pool A
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('GARGI', 'GARGI', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#d32f2f', '#FFFFFF'),
('BENNETT A', 'BENNETT A', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#f57c00', '#FFFFFF'),
('MODY', 'MODY', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#00695c', '#FFFFFF'),
('IILM', 'IILM', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#1565c0', '#FFFFFF'),
('SRM', 'SRM', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#c62828', '#FFFFFF'),
-- Pool B
('MATA S.', 'MATA S.', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#7b1fa2', '#FFFFFF'),
('ASHOKA', 'ASHOKA', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#1565c0', '#FFFFFF'),
('KUMAON', 'KUMAON', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#1976d2', '#FFFFFF'),
('OP JINDAL', 'OP JINDAL', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#1a4d8f', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'volleyball-girls'), '#f57c00', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Kabaddi Teams
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('ZHDC', 'ZHDC', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#1565c0', '#FFFFFF'),
('SHARDA', 'SHARDA', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#00796b', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#f57c00', '#FFFFFF'),
('NIU', 'NIU', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#512da8', '#FFFFFF'),
('BENNETT A', 'BENNETT A', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#f57c00', '#FFFFFF'),
('BML', 'BML', (SELECT id FROM sports WHERE slug = 'kabaddi'), '#558b2f', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Football Teams - Pool A
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('GALGOTIA', 'GALGOTIA', (SELECT id FROM sports WHERE slug = 'football'), '#558b2f', '#FFFFFF'),
('SNU', 'SNU', (SELECT id FROM sports WHERE slug = 'football'), '#6a1b9a', '#FFFFFF'),
('DOON', 'DOON', (SELECT id FROM sports WHERE slug = 'football'), '#c62828', '#FFFFFF'),
-- Pool B
('BENNETT A', 'BENNETT A', (SELECT id FROM sports WHERE slug = 'football'), '#f57c00', '#FFFFFF'),
('SHARDA', 'SHARDA', (SELECT id FROM sports WHERE slug = 'football'), '#00796b', '#FFFFFF'),
('MIU', 'MIU', (SELECT id FROM sports WHERE slug = 'football'), '#1976d2', '#FFFFFF'),
-- Pool C
('ASHOKA', 'ASHOKA', (SELECT id FROM sports WHERE slug = 'football'), '#1565c0', '#FFFFFF'),
('AMITY', 'AMITY', (SELECT id FROM sports WHERE slug = 'football'), '#d32f2f', '#FFFFFF'),
('BRAC', 'BRAC', (SELECT id FROM sports WHERE slug = 'football'), '#7b1fa2', '#FFFFFF'),
-- Pool D
('ALUMNI', 'ALUMNI', (SELECT id FROM sports WHERE slug = 'football'), '#1976d2', '#FFFFFF'),
('SGGSCC', 'SGGSCC', (SELECT id FROM sports WHERE slug = 'football'), '#0097a7', '#FFFFFF'),
('BENNETT B', 'BENNETT B', (SELECT id FROM sports WHERE slug = 'football'), '#f57c00', '#FFFFFF'),
('DOON GLOBAL', 'DOON GLOBAL', (SELECT id FROM sports WHERE slug = 'football'), '#c62828', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;

-- Add Cricket Teams
INSERT INTO teams (name, short_name, sport_id, color_primary, color_secondary) VALUES
('SNU', 'SNU', (SELECT id FROM sports WHERE slug = 'cricket'), '#6a1b9a', '#FFFFFF'),
('IILM', 'IILM', (SELECT id FROM sports WHERE slug = 'cricket'), '#1565c0', '#FFFFFF'),
('UPES', 'UPES', (SELECT id FROM sports WHERE slug = 'cricket'), '#558b2f', '#FFFFFF'),
('SRM', 'SRM', (SELECT id FROM sports WHERE slug = 'cricket'), '#c62828', '#FFFFFF'),
('VENKY', 'VENKY', (SELECT id FROM sports WHERE slug = 'cricket'), '#1976d2', '#FFFFFF'),
('MANIPAL', 'MANIPAL', (SELECT id FROM sports WHERE slug = 'cricket'), '#00796b', '#FFFFFF')
ON CONFLICT (name, sport_id) DO NOTHING;
