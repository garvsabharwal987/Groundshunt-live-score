-- Add enable_live_scoring column to fixtures table
ALTER TABLE fixtures ADD COLUMN IF NOT EXISTS enable_live_scoring BOOLEAN DEFAULT true;

-- Add comment explaining the column
COMMENT ON COLUMN fixtures.enable_live_scoring IS 'Whether this fixture will have live scoring updates or direct final results';
