import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
          t.*,
          json_object('id', s.id, 'name', s.name, 'slug', s.slug) as sport
        FROM teams t
        LEFT JOIN sports s ON t.sport_id = s.id
      `;

      const params: any[] = [];
      if (sportId) {
        query += ' WHERE t.sport_id = ?';
        params.push(sportId);
      }

      query += ' ORDER BY t.name ASC';

      const stmt = database.prepare(query);
      const rows = params.length > 0 ? stmt.all(...params) : stmt.all();

      // Parse JSON fields
      const data = (rows as any[]).map((row: any) => ({
        ...row,
        sport: typeof row.sport === 'string' ? JSON.parse(row.sport) : row.sport,
      }));

      return NextResponse.json(data);
    } else {
      // Supabase mode
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('teams')
        .select(`
          *,
          sport:sports(*)
        `)
        .order('name');

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
    console.error('Teams API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('teams')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
