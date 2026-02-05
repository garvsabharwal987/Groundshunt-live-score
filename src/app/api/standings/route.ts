import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const USE_LOCAL_SQLITE = process.env.NEXT_PUBLIC_USE_LOCAL_SQLITE === 'true';

// For SQLite support
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
  const { searchParams } = new URL(request.url);
  const sportId = searchParams.get('sport_id');

  try {
    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      let query = `
        SELECT 
          pt.id, pt.team_id, pt.sport_id, pt.group_name, pt.played, pt.won, pt.lost, pt.drawn, pt.points, pt.net_run_rate, pt.created_at,
          COALESCE(t.id, '') as team_id_val, COALESCE(t.name, '') as team_name, COALESCE(t.short_name, '') as team_short, COALESCE(t.sport_id, '') as team_sport,
          COALESCE(s.id, '') as sport_id_val, COALESCE(s.name, '') as sport_name, COALESCE(s.slug, '') as sport_slug
        FROM points_table pt
        LEFT JOIN teams t ON pt.team_id = t.id
        LEFT JOIN sports s ON pt.sport_id = s.id
      `;

      const params: any[] = [];
      if (sportId) {
        query += ' WHERE pt.sport_id = ?';
        params.push(sportId);
      }

      query += ' ORDER BY pt.points DESC, pt.net_run_rate DESC';

      const stmt = database.prepare(query);
      const rows = params.length > 0 ? stmt.all(...params) : stmt.all();

      // Parse JSON fields
      const data = (rows as any[]).map((row: any) => ({
        id: row.id,
        team_id: row.team_id,
        sport_id: row.sport_id,
        group_name: row.group_name,
        played: row.played,
        won: row.won,
        lost: row.lost,
        drawn: row.drawn,
        points: row.points,
        net_run_rate: row.net_run_rate,
        created_at: row.created_at,
        team: row.team_id_val ? {
          id: row.team_id_val,
          name: row.team_name,
          short_name: row.team_short,
          sport_id: row.team_sport,
        } : null,
        sport: row.sport_id_val ? {
          id: row.sport_id_val,
          name: row.sport_name,
          slug: row.sport_slug,
        } : null,
      }));

      return NextResponse.json(data);
    } else {
      // Supabase mode
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('points_table')
        .select(`
          *,
          team:teams(*),
          sport:sports(*)
        `)
        .order('points', { ascending: false })
        .order('net_run_rate', { ascending: false });

      if (sportId) {
        query = query.eq('sport_id', sportId);
      }

      const { data, error } = await query;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Standings API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      const { team_id, sport_id, points, net_run_rate } = body;
      
      const stmt = database.prepare(`
        INSERT INTO points_table (team_id, sport_id, points, net_run_rate)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run(team_id, sport_id, points || 0, net_run_rate || 0);

      // Fetch and return the inserted record
      const selectStmt = database.prepare(`
        SELECT 
          pt.*,
          json_object('id', t.id, 'name', t.name, 'short_name', t.short_name, 'sport_id', t.sport_id) as team,
          json_object('id', s.id, 'name', s.name, 'slug', s.slug) as sport
        FROM points_table pt
        LEFT JOIN teams t ON pt.team_id = t.id
        LEFT JOIN sports s ON pt.sport_id = s.id
        WHERE pt.team_id = ? AND pt.sport_id = ?
      `);
      
      const row = selectStmt.get(team_id, sport_id);
      const data = {
        ...row,
        team: typeof row.team === 'string' ? JSON.parse(row.team) : row.team,
        sport: typeof row.sport === 'string' ? JSON.parse(row.sport) : row.sport,
      };

      return NextResponse.json(data);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('points_table')
        .insert(body)
        .select(`
          *,
          team:teams(*),
          sport:sports(*)
        `)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('POST standings error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      const updates: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(updateData)) {
        updates.push(`${key} = ?`);
        params.push(value);
      }

      params.push(id);

      const stmt = database.prepare(`
        UPDATE points_table
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      stmt.run(...params);

      // Fetch and return the updated record
      const selectStmt = database.prepare(`
        SELECT 
          pt.*,
          json_object('id', t.id, 'name', t.name, 'short_name', t.short_name, 'sport_id', t.sport_id) as team,
          json_object('id', s.id, 'name', s.name, 'slug', s.slug) as sport
        FROM points_table pt
        LEFT JOIN teams t ON pt.team_id = t.id
        LEFT JOIN sports s ON pt.sport_id = s.id
        WHERE pt.id = ?
      `);

      const row = selectStmt.get(id);
      const data = {
        ...row,
        team: typeof row.team === 'string' ? JSON.parse(row.team) : row.team,
        sport: typeof row.sport === 'string' ? JSON.parse(row.sport) : row.sport,
      };

      return NextResponse.json(data);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('points_table')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          team:teams(*),
          sport:sports(*)
        `)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('PUT standings error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

