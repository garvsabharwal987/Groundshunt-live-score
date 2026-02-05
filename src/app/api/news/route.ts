import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      let query = `
        SELECT * FROM news_of_the_day
      `;

      if (!showAll) {
        query += ' WHERE is_published = 1';
      }

      query += ' ORDER BY publish_date DESC, created_at DESC';

      if (!showAll) {
        query += ' LIMIT 20';
      }

      const stmt = database.prepare(query);
      const rows: any[] = stmt.all();

      return NextResponse.json(rows);
    } else {
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('news_of_the_day')
        .select('*')
        .order('publish_date', { ascending: false })
        .order('created_at', { ascending: false });

      // For admin, show all news; for users, only published ones
      if (!showAll) {
        query = query.eq('is_published', true).limit(20);
      }

      const { data, error } = await query;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (USE_LOCAL_SQLITE) {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      const stmt = database.prepare(`
        INSERT INTO news_of_the_day (title, content, summary, featured_image_url, is_published, publish_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        body.title,
        body.content,
        body.summary || '',
        body.featured_image_url || null,
        body.is_published ?? 1,
        body.publish_date || new Date().toISOString(),
        new Date().toISOString()
      );

      // Fetch and return the inserted row
      const selectStmt = database.prepare(`
        SELECT * FROM news_of_the_day 
        WHERE title = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      const row: any = selectStmt.get(body.title);

      return NextResponse.json(row);
    } else {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('news_of_the_day')
        .insert({
          title: body.title,
          content: body.content,
          featured_image_url: body.featured_image_url,
          is_published: body.is_published ?? true,
          publish_date: body.publish_date || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Post news error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
