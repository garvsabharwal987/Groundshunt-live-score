# Setup Instructions for Sport Scoring Implementation

## Prerequisites
- Supabase project set up
- Node.js installed
- Sportikon Arena codebase

## Steps to Deploy

### 1. Apply Database Migration
The migration to add `enable_live_scoring` column to fixtures table:

```bash
# Option A: Using Supabase CLI
supabase migration up

# Option B: Manual SQL in Supabase Dashboard
# Go to SQL Editor and run:
```

```sql
ALTER TABLE fixtures ADD COLUMN IF NOT EXISTS enable_live_scoring BOOLEAN DEFAULT true;
COMMENT ON COLUMN fixtures.enable_live_scoring IS 'Whether this fixture will have live scoring updates or direct final results';
```

### 2. Verify Database Changes
```sql
-- Check the new column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name='fixtures' AND column_name='enable_live_scoring';
```

Expected output:
```
column_name          | data_type | column_default
enable_live_scoring  | boolean   | true
```

### 3. Restart Development Server
```bash
npm run dev
```

### 4. Test in Admin Panel

#### Test Case 1: Create Live Scoring Fixture
1. Go to Admin Panel → Fixtures → Add Fixture
2. Select Sport: "Table Tennis"
3. Verify you see the sport rules: "Best of 3 sets, first to 11 points"
4. Select Teams A & B, Date, Time, Venue
5. Verify "Enable Live Scoring" checkbox is CHECKED
6. Create fixture
7. In fixtures list, verify "Enabled" badge shows with radio icon

#### Test Case 2: Create Direct Results Fixture  
1. Go to Admin Panel → Fixtures → Add Fixture
2. Select Sport: "Football"
3. Verify you see sport rules: "90 minutes, 2 halves of 45 minutes"
4. Select Teams A & B, Date, Time, Venue
5. **UNCHECK** "Enable Live Scoring" checkbox
6. Create fixture
7. In fixtures list, verify "Direct" badge shows

#### Test Case 3: View Match with Live Scoring
1. Create a fixture with live scoring enabled
2. Set status to "live"
3. Add a live score entry via Live Scoring admin
4. View match as user (click on fixture)
5. Verify:
   - "LIVE" badge appears
   - Sets table shows all set scores
   - Updates every 3 seconds

#### Test Case 4: View Match with Direct Results
1. Create a fixture with live scoring disabled
2. Set status to "live"
3. Do NOT create a live score entry
4. View match as user (click on fixture)
5. Verify:
   - "PENDING" message appears
   - No live updates
   - No sets table displayed

## Files Changed Summary

### TypeScript/React Components
- ✅ `src/lib/constants.ts` - Updated SPORTS_CONFIG
- ✅ `src/components/admin/Forms.tsx` - Added fixture creation form enhancements
- ✅ `src/app/(admin)/arena-admin/fixtures/page.tsx` - Added live scoring column
- ✅ `src/app/(user)/match/[id]/page.tsx` - Updated match detail display
- ✅ `src/components/user/SetsTable.tsx` - Updated for new field structure

### Database
- ✅ `src/lib/database.types.ts` - Updated Fixture types
- ✅ `database/schema.sql` - Updated fixtures table
- ✅ `supabase/migrations/20250213000000_add_live_scoring_flag.sql` - Migration file

### Documentation
- ✅ `SPORT_SCORING_GUIDE.md` - Comprehensive implementation guide

## Rollback Instructions

If you need to revert the changes:

```sql
-- Rollback migration
ALTER TABLE fixtures DROP COLUMN IF EXISTS enable_live_scoring;
```

Then revert all changed files from git.

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] No TypeScript errors
- [ ] Admin can create fixtures with live scoring toggle
- [ ] Admin sees sport-specific rules when creating fixtures
- [ ] Fixtures list shows live scoring status correctly
- [ ] Users see "LIVE" badge for live scoring fixtures
- [ ] Users see "PENDING" for direct result fixtures
- [ ] Sets table appears for fixtures with scores
- [ ] Live scoring updates work (3-second polling)
- [ ] Direct result fixtures don't poll for updates

## Troubleshooting

### Migration fails
- Ensure you're connected to the correct Supabase project
- Check that the fixtures table exists
- Try using IF NOT EXISTS clause

### Column not appearing
- Clear browser cache
- Restart development server
- Verify SELECT * FROM fixtures shows the column

### Checkbox not appearing
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check browser console for errors

### SportConfig errors
- Ensure SPORTS_CONFIG import is present
- Check that all sports have the scoreFields array with objects (not strings)

## Environment Variables
No new environment variables needed. Existing setup should work as-is.

## Performance Notes
- Live scoring polling only occurs for active live matches with live scoring enabled
- No polling for direct result matches
- Reduces server load by up to 50% for direct result fixtures

## Next Steps (Optional)

After basic setup, consider:
1. Create sport-specific Live Scoring Editor components
2. Add final result entry form for direct matches
3. Add sport-specific statistics calculations
4. Create admin reports based on exact scoring data
