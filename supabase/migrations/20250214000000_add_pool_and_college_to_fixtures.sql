-- Add pool and college_name columns to fixtures table
ALTER TABLE fixtures
ADD COLUMN pool VARCHAR(50),
ADD COLUMN college_name VARCHAR(150);

-- Add comment for documentation
COMMENT ON COLUMN fixtures.pool IS 'Pool identifier for tournament brackets (e.g., Pool A, Pool B)';
COMMENT ON COLUMN fixtures.college_name IS 'College/Institution name for the match';
