-- Add college_name column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS college_name TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_teams_college_name ON teams(college_name);
