# Sport Scoring Implementation Guide

## Overview
This document explains how exact sport-specific scoring is implemented in Sportikon Arena.

## Features Implemented

### 1. Sport-Specific Scoring Rules
Each sport has defined, exact scoring rules that are enforced throughout the system.

#### Table Tennis
- **Scoring Format**: Best of 3 sets, first to 11 points per set
- **Score Fields**: Set 1, Set 2, Set 3, Sets Won
- **Example**: Team A wins Set 1 (11-9), Set 2 (11-7), Sets won: 2

#### Football
- **Scoring Format**: 90 minutes, 2 halves of 45 minutes each
- **Score Fields**: Goals, Shots, Possession %
- **Example**: Team A scores 2 goals, 8 shots, 55% possession

#### Basketball
- **Scoring Format**: 4 quarters of 10 minutes each
- **Score Fields**: Q1, Q2, Q3, Q4, Total Points
- **Example**: Team A: 25+28+22+0 = 75 points

#### Badminton
- **Scoring Format**: Best of 3 sets, first to 21 points per set
- **Score Fields**: Set 1, Set 2, Set 3, Sets Won
- **Example**: Team A wins Set 1 (21-15), Set 2 (21-14), Sets won: 2

#### Volleyball
- **Scoring Format**: Best of 5 sets, first to 25 points per set
- **Score Fields**: Set 1, Set 2, Set 3, Set 4, Set 5, Sets Won
- **Example**: Team A wins Set 1 (25-22), Set 2 (25-20), remaining sets 0, Sets won: 2

### 2. Live Scoring Toggle
When creating or editing a fixture, admins can enable/disable live scoring:

#### Live Scoring ENABLED (default)
- Allows real-time score updates during the match
- Shows "LIVE" badge with updating timestamp
- Displays "Set 1", "Set 2", etc. columns in the match detail
- Best for matches that are being actively updated
- `enable_live_scoring: true`

#### Live Scoring DISABLED (Direct Results)
- Used for matches where only final results are entered
- Shows "PENDING" status while match is live
- Only final aggregated scores are entered after match completion
- Admin enters final results directly via form
- `enable_live_scoring: false`

### 3. Admin Fixture Creation UI Improvements
- **Sport Selector**: Clearly displays the selected sport's exact scoring rules
- **Score Fields Display**: Shows all applicable score fields for the selected sport
- **Live Scoring Checkbox**: Toggle to enable/disable live score updates
- **Visual Instructions**: Blue info box shows scoring rule details

### 4. Fixture List in Admin Panel
The fixtures table now displays:
- ✓ "Enabled" badge with live radio icon for fixtures with live scoring
- ✓ "Direct" badge for fixtures with direct result entry only
- Helps admins distinguish between live-updating and direct-result matches

### 5. User-Facing Match Details Page
When users view a fixture:

**If Live Scoring is ENABLED:**
- Shows "LIVE" badge when match is in progress
- Displays real-time updates with timestamp
- Shows detailed score table with all set/quarter information
- Updates every 3 seconds during live matches

**If Live Scoring is DISABLED:**
- Shows "PENDING" during match progress
- Shows final results after match completion
- Direct result entry - no live updates
- Cleaner display focused on final outcome

## Database Schema

### Fixtures Table Changes
```sql
ALTER TABLE fixtures ADD COLUMN enable_live_scoring BOOLEAN DEFAULT true;
```

### Updated Fields in database.types.ts
- Added `enable_live_scoring: boolean` to Fixture Row, Insert, and Update types

## Implementation Details

### Files Modified

1. **src/lib/constants.ts**
   - Updated SPORTS_CONFIG with detailed field definitions
   - Added description and type information for each field
   - Format: `{ key: string, label: string, type: 'points' | 'quarter' | 'stats' | 'summary' }`

2. **src/components/admin/Forms.tsx**
   - Added SPORTS_CONFIG import
   - Added enable_live_scoring to formData state
   - Added Live Scoring checkbox with description
   - Added sport scoring rules display box
   - Shows fields, scoring format, and rules

3. **src/app/(admin)/arena-admin/fixtures/page.tsx**
   - Added Radio icon import
   - Added Live Scoring column to fixtures table
   - Shows "Enabled" or "Direct" badges
   - Updated colSpan values for table consistency

4. **src/app/(user)/match/[id]/page.tsx**
   - Updated polling logic to only run for live matches with live scoring enabled
   - Updated match status display to show "PENDING" for live matches without live scoring
   - Added conditional rendering based on enable_live_scoring flag

5. **src/components/user/SetsTable.tsx**
   - Updated to work with new field structure (object with key, label, type)
   - Filters for non-summary fields in score columns
   - Displays summary field (sets_won) separately

6. **src/lib/database.types.ts**
   - Added enable_live_scoring field to all fixture types

7. **database/schema.sql**
   - Added enable_live_scoring column to fixtures table

8. **supabase/migrations/20250213000000_add_live_scoring_flag.sql**
   - Migration file for adding enable_live_scoring column

## API Endpoints
All existing API endpoints automatically include the enable_live_scoring field:
- `GET /api/fixtures` - Returns all fixtures with enable_live_scoring
- `GET /api/fixtures/{id}` - Returns single fixture
- `POST /api/fixtures` - Create with enable_live_scoring field
- `PUT /api/fixtures/{id}` - Update including enable_live_scoring

## Usage Workflow

### Admin Creates a Live Scoring Match
1. Goes to Admin Panel > Fixtures > Add Fixture
2. Selects Sport (e.g., "Table Tennis")
3. Automatically sees scoring rules: "Best of 3 sets, first to 11 points"
4. Selects teams, date, time, venue
5. **Checkbox "Enable Live Scoring"** - CHECKED (default)
6. Creates fixture
7. During match, uses Live Scoring Editor to update Set 1, Set 2, etc.

### Admin Creates a Direct Results Match
1. Goes to Admin Panel > Fixtures > Add Fixture
2. Selects Sport
3. Sees scoring rules
4. Selects teams, date, time, venue
5. **Checkbox "Enable Live Scoring"** - UNCHECKED
6. Creates fixture
7. After match, enters final score directly (e.g., Sets won: 2-1)

### User Views Match
- If Live Scoring enabled: Sees "LIVE" badge, real-time updates
- If Live Scoring disabled: Sees "PENDING" during match, final results after
- Both show complete score tables in match detail page

## Future Enhancements
- [ ] Sport-specific live scoring editors for each sport type
- [ ] API endpoints for direct result submission
- [ ] Statistics calculations based on exact scoring data
- [ ] Sport-specific final result entry forms
- [ ] Historical statistics based on exact scoring data
