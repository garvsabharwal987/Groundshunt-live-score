# Supabase Migration Steps

## Status: COMPLETE ✅

All API routes have been verified to be **Supabase-only** with no SQLite conditionals remaining.

## What's Done

✅ All API routes are using Supabase exclusively:
- `src/app/api/fixtures/route.ts` - Supabase only
- `src/app/api/fixtures/[id]/route.ts` - Supabase only
- `src/app/api/live/route.ts` - Supabase only
- `src/app/api/live/[id]/route.ts` - Supabase only
- `src/app/api/standings/route.ts` - Supabase only
- `src/app/api/sports/route.ts` - Supabase only
- `src/app/api/teams/route.ts` - Supabase only
- `src/app/api/teams/[id]/route.ts` - Supabase only
- `src/app/api/venues/route.ts` - Supabase only
- `src/app/api/news/route.ts` - Supabase only

✅ Frontend pages updated to use API endpoints:
- `src/app/(user)/fixtures/page.tsx` - Uses /api/fixtures
- `src/app/(user)/standings/page.tsx` - Uses /api/standings

✅ Environment configured:
- `.env.local` - NEXT_PUBLIC_USE_LOCAL_SQLITE=false

✅ UI updated:
- Winner selection (winner_id and is_draw) added to Edit Fixture modal

## What You Need to Do

### Step 1: Create Supabase Tables

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Open SQL Editor
4. Create a new query and paste the entire content from `SUPABASE_SCHEMA.sql`
5. Click "Run" to execute all SQL

**Critical**: The schema includes:
- All tables with exact column names matching the app expectations
- Foreign key relationships (CASCADE deletes configured)
- Indexes for performance
- Sample data for testing (sports, teams, venues, fixtures)

### Step 2: Verify Environment Variables

Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from Supabase Dashboard → Settings → API

### Step 3: Test the Migration

1. Clear Next.js cache: `rm -r .next`
2. Restart dev server: `npm run dev`
3. Visit admin panel: Test fixture creation/editing
4. Visit user panel: Verify fixtures, standings, live matches load
5. Check browser console and terminal for any errors

### Step 4: Important Column Names

All tables use these exact column names (matching your requirements):
- **fixtures**: id, sport_id, team_a_id, team_b_id, venue_id, match_date, match_time, status, round, match_number, winner_id, is_draw, created_at, updated_at
- **live_scores**: id, fixture_id, team_a_score, team_b_score, current_period, elapsed_time, last_event, updated_at
- **standings** (points_table): id, sport_id, team_id, group_name, played, won, lost, drawn, points, net_run_rate, created_at, updated_at
- **sports**: id, name, slug, icon, is_active, created_at, updated_at
- **teams**: id, name, short_name, sport_id, primary_color, secondary_color, logo_url, created_at, updated_at
- **venues**: id, name, location, capacity, created_at, updated_at
- **news_of_the_day**: id, title, description, content, image_url, sport_id, is_featured, published_at, created_at, updated_at

### Step 5: Migrate Existing Data (If Any)

If you have data in SQLite that needs to be migrated:
1. Export SQLite data as CSV/JSON
2. Import into Supabase tables through the dashboard
3. Verify all relationships are intact

## Architecture

The app now uses a **clean Supabase-only architecture**:

```
Frontend (Pages/Components)
    ↓
API Routes (src/app/api/*)
    ↓
Supabase Client
    ↓
Supabase PostgreSQL Database
```

No more SQLite, no more dual-logic conditionals. Single source of truth: **Supabase**.

## Next Steps After Setup

1. ✅ Create schema (see Step 1)
2. ✅ Verify environment variables (see Step 2)
3. ✅ Test the app (see Step 3)
4. 🔄 Monitor for any column name mismatches
5. 🔄 Add authentication if needed
6. 🔄 Add RLS (Row Level Security) policies if needed
7. 🔄 Set up backups in Supabase dashboard

## Troubleshooting

**Problem**: "Relation 'fixtures' does not exist"
- Solution: Run SUPABASE_SCHEMA.sql in Supabase SQL Editor

**Problem**: "Column 'X' does not exist"
- Solution: Check SUPABASE_SCHEMA.sql for correct column names, verify they match your queries

**Problem**: API returns 500 errors
- Solution: Check Supabase project logs and app terminal for detailed error messages

**Problem**: Foreign key constraint errors
- Solution: Verify data integrity when inserting; ensure referenced IDs exist first

## Column Name Consistency Check ✅

✅ All column names are consistent across:
- SUPABASE_SCHEMA.sql (table definitions)
- API routes (query usage)
- Frontend components (form fields)

Example: `winner_id` in fixtures table matches the form field added to Edit Fixture modal.
