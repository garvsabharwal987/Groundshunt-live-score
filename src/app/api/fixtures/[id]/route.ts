import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const USE_LOCAL_SQLITE = process.env.NEXT_PUBLIC_USE_LOCAL_SQLITE === 'true';

let db: any = null;

async function getDatabase() {
  if (!USE_LOCAL_SQLITE) return null;
  if (!db) {
    const { getDatabase: getDb } = await import('@/lib/sqlite/db');
    db = getDb();
  }
  return db;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      const fixturesQuery = 'SELECT ' +
        'f.id as fixture_id, f.sport_id, f.team_a_id, f.team_b_id, f.venue_id, f.match_date, f.match_time, f.status, f.round, f.match_number, f.winner_id, f.is_draw, f.created_at, f.updated_at, ' +
        'COALESCE(s.id, \'\') as sport_id_val, COALESCE(s.name, \'\') as sport_name, COALESCE(s.slug, \'\') as sport_slug, ' +
        'COALESCE(ta.id, \'\') as team_a_id_val, COALESCE(ta.name, \'\') as team_a_name, COALESCE(ta.short_name, \'\') as team_a_short, COALESCE(ta.sport_id, \'\') as team_a_sport, ' +
        'COALESCE(tb.id, \'\') as team_b_id_val, COALESCE(tb.name, \'\') as team_b_name, COALESCE(tb.short_name, \'\') as team_b_short, COALESCE(tb.sport_id, \'\') as team_b_sport, ' +
        'COALESCE(w.id, \'\') as winner_id_val, COALESCE(w.name, \'\') as winner_name, COALESCE(w.short_name, \'\') as winner_short, COALESCE(w.sport_id, \'\') as winner_sport, ' +
        'COALESCE(v.id, \'\') as venue_id_val, COALESCE(v.name, \'\') as venue_name, COALESCE(v.location, \'\') as venue_location ' +
        'FROM fixtures f ' +
        'LEFT JOIN sports s ON f.sport_id = s.id ' +
        'LEFT JOIN teams ta ON f.team_a_id = ta.id ' +
        'LEFT JOIN teams tb ON f.team_b_id = tb.id ' +
        'LEFT JOIN teams w ON f.winner_id = w.id ' +
        'LEFT JOIN venues v ON f.venue_id = v.id ' +
        'WHERE f.id = ?';

      const stmt = database.prepare(fixturesQuery);
      const row: any = stmt.get(id);

      if (!row) {
        return NextResponse.json({ error: 'Fixture not found' }, { status: 404 });
      }

      // Get live score
      const liveScoreStmt = database.prepare('SELECT * FROM live_scores WHERE fixture_id = ?');
      const liveScoreRow: any = liveScoreStmt.get(row.fixture_id);

      const liveScore = liveScoreRow ? {
        id: liveScoreRow.id,
        fixture_id: liveScoreRow.fixture_id,
        team_a_score: typeof liveScoreRow.team_a_score === 'string' ? JSON.parse(liveScoreRow.team_a_score) : liveScoreRow.team_a_score,
        team_b_score: typeof liveScoreRow.team_b_score === 'string' ? JSON.parse(liveScoreRow.team_b_score) : liveScoreRow.team_b_score,
        current_period: liveScoreRow.current_period,
        elapsed_time: liveScoreRow.elapsed_time,
        last_event: liveScoreRow.last_event,
        updated_at: liveScoreRow.updated_at,
      } : null;

      // Parse JSON fields
      const fixture = {
        id: row.fixture_id,
        sport_id: row.sport_id,
        team_a_id: row.team_a_id,
        team_b_id: row.team_b_id,
        venue_id: row.venue_id,
        match_date: row.match_date,
        match_time: row.match_time,
        status: row.status,
        round: row.round,
        match_number: row.match_number,
        winner_id: row.winner_id,
        is_draw: row.is_draw,
        created_at: row.created_at,
        updated_at: row.updated_at,
        sport: row.sport_id_val ? {
          id: row.sport_id_val,
          name: row.sport_name,
          slug: row.sport_slug,
        } : null,
        team_a: row.team_a_id_val ? {
          id: row.team_a_id_val,
          name: row.team_a_name,
          short_name: row.team_a_short,
          sport_id: row.team_a_sport,
        } : null,
        team_b: row.team_b_id_val ? {
          id: row.team_b_id_val,
          name: row.team_b_name,
          short_name: row.team_b_short,
          sport_id: row.team_b_sport,
        } : null,
        winner: row.winner_id_val ? {
          id: row.winner_id_val,
          name: row.winner_name,
          short_name: row.winner_short,
          sport_id: row.winner_sport,
        } : null,
        venue: row.venue_id_val ? {
          id: row.venue_id_val,
          name: row.venue_name,
          location: row.venue_location,
        } : null,
        live_score: liveScore,
      };

      return NextResponse.json(fixture);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data: fixture, error } = await supabase
        .from('fixtures')
        .select(`
          *,
          sport:sports(*),
          team_a:teams!fixtures_team_a_id_fkey(*),
          team_b:teams!fixtures_team_b_id_fkey(*),
          winner:teams!fixtures_winner_id_fkey(*),
          venue:venues(*),
          live_score:live_scores(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const formatted = {
        ...fixture,
        live_score: Array.isArray(fixture.live_score) ? fixture.live_score[0] : fixture.live_score
      };

      return NextResponse.json(formatted);
    }
  } catch (error: any) {
    console.error('Get fixture error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('fixtures')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('fixtures')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
