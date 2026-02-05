import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDatabase } from '@/lib/sqlite/db';
import { NextRequest, NextResponse } from 'next/server';

const USE_LOCAL_SQLITE = process.env.NEXT_PUBLIC_USE_LOCAL_SQLITE === 'true';

export async function GET() {
  if (USE_LOCAL_SQLITE) {
    try {
      const database = await getDatabase();
      if (!database) throw new Error('Database not available');

      const stmt = database.prepare('SELECT * FROM sports ORDER BY name');
      const sports = stmt.all();

      return NextResponse.json(sports);
    } catch (error: any) {
      console.error('Get sports error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('sports')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('sports')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('sports')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('sports')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
