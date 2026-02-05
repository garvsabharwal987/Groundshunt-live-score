import { createLocalClient } from '@/lib/sqlite/client';
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      let whereClause = '';
      const params: any[] = [];

      if (status && status !== 'all') {
        whereClause = ' WHERE f.status = ?';
        params.push(status);
      }

      const fixturesQuery = 'SELECT ' +
        'f.id as fixture_id, f.sport_id, f.team_a_id, f.team_b_id, f.venue_id, f.match_date, f.match_time, f.status, f.round, f.match_number, f.winner_id, f.is_draw, f.created_at, f.updated_at, ' +
        'COALESCE(s.id, \'\') as sport_id_val, COALESCE(s.name, \'\') as sport_name, COALESCE(s.slug, \'\') as sport_slug, ' +
        'COALESCE(ta.id, \'\') as team_a_id_val, COALESCE(ta.name, \'\') as team_a_name, COALESCE(ta.short_name, \'\') as team_a_short, COALESCE(ta.sport_id, \'\') as team_a_sport, ' +
        'COALESCE(tb.id, \'\') as team_b_id_val, COALESCE(tb.name, \'\') as team_b_name, COALESCE(tb.short_name, \'\') as team_b_short, COALESCE(tb.sport_id, \'\') as team_b_sport, ' +
        'COALESCE(v.id, \'\') as venue_id_val, COALESCE(v.name, \'\') as venue_name, COALESCE(v.location, \'\') as venue_location ' +
        'FROM fixtures f ' +
        'LEFT JOIN sports s ON f.sport_id = s.id ' +
        'LEFT JOIN teams ta ON f.team_a_id = ta.id ' +
        'LEFT JOIN teams tb ON f.team_b_id = tb.id ' +
        'LEFT JOIN venues v ON f.venue_id = v.id ' +
        whereClause +
        ' ORDER BY f.match_date ASC, f.match_time ASC';

      const stmt = database.prepare(fixturesQuery);
      const fixtures: any[] = params.length > 0 ? stmt.all(...params) : stmt.all();

      // For each fixture, get live score
      const formatted = fixtures.map((row: any) => {
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

        return {
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
          venue: row.venue_id_val ? {
            id: row.venue_id_val,
            name: row.venue_name,
            location: row.venue_location,
          } : null,
          live_score: liveScore,
        };
      });

      return NextResponse.json(formatted);
    } else {
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('fixtures')
        .select(`
          *,
          sport:sports(*),
          team_a:teams!fixtures_team_a_id_fkey(*),
          team_b:teams!fixtures_team_b_id_fkey(*),
          venue:venues(*),
          live_score:live_scores(*)
        `)
        .order('match_date', { ascending: true })
        .order('match_time', { ascending: true });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: fixtures, error } = await query;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const formatted = fixtures?.map((d: any) => ({
        ...d,
        live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
      }));

      return NextResponse.json(formatted);
    }
  } catch (error: any) {
    console.error('Get fixtures error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = createLocalClient();
    const body = await request.json();

    // Optionally, add auth here if needed
    // const { data: { user } } = await client.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    return await new Promise((resolve) => {
      client
        .from('fixtures')
        .insert(body)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Fixture insert error:', error);
            resolve(NextResponse.json({ error: (error as any).message || String(error), details: error }, { status: 500 }));
          } else {
            resolve(NextResponse.json(data, { status: 201 }));
          }
        })
        .catch((err: unknown) => {
          console.error('Fixture insert catch error:', err);
          resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
        });
    });
  } catch (error) {
    console.error('Fixture POST error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
