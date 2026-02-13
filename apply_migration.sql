-- Run this SQL in Supabase SQL Editor to add the enable_live_scoring column

-- Add column if it doesn't exist
ALTER TABLE fixtures ADD COLUMN IF NOT EXISTS enable_live_scoring BOOLEAN DEFAULT true;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name='fixtures' AND column_name='enable_live_scoring';
