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

      const stmt = database.prepare(`
        SELECT * FROM live_scores WHERE fixture_id = ?
      `);
      const row: any = stmt.get(id);

      if (!row) {
        return NextResponse.json({ error: 'Live score not found' }, { status: 404 });
      }

      // Parse JSON fields if stored as strings
      const data = {
        ...row,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      };

      return NextResponse.json(data);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('live_scores')
        .select('*')
        .eq('fixture_id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Get live score error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      // Check if live score exists
      const checkStmt = database.prepare(`
        SELECT id FROM live_scores WHERE fixture_id = ?
      `);
      const existing = checkStmt.get(id);

      if (existing) {
        // Update existing
        const updateStmt = database.prepare(`
          UPDATE live_scores 
          SET data = ?, updated_at = ?
          WHERE fixture_id = ?
        `);
        updateStmt.run(
          JSON.stringify(body),
          new Date().toISOString(),
          id
        );
      } else {
        // Insert new
        const insertStmt = database.prepare(`
          INSERT INTO live_scores (fixture_id, data, created_at, updated_at)
          VALUES (?, ?, ?, ?)
        `);
        insertStmt.run(
          id,
          JSON.stringify(body),
          new Date().toISOString(),
          new Date().toISOString()
        );
      }

      // Fetch and return the updated record
      const selectStmt = database.prepare(`
        SELECT * FROM live_scores WHERE fixture_id = ?
      `);
      const row: any = selectStmt.get(id);

      const data = {
        ...row,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      };

      return NextResponse.json(data);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if live score exists
      const { data: existing } = await supabase
        .from('live_scores')
        .select('id')
        .eq('fixture_id', id)
        .single();

      let data, error;

      if (existing) {
        // Update existing live score
        ({ data, error } = await supabase
          .from('live_scores')
          .update({
            team_a_score: body.team_a_score,
            team_b_score: body.team_b_score,
            current_period: body.current_period,
            elapsed_time: body.elapsed_time,
            last_event: body.last_event,
            updated_at: new Date().toISOString(),
          })
          .eq('fixture_id', id)
          .select()
          .single());
      } else {
        // Create new live score
        ({ data, error } = await supabase
          .from('live_scores')
          .insert({
            fixture_id: id,
            team_a_score: body.team_a_score || {},
            team_b_score: body.team_b_score || {},
            current_period: body.current_period || '1st',
            elapsed_time: body.elapsed_time || '0',
            last_event: body.last_event || '',
          })
          .select()
          .single());
      }

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Put live score error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
