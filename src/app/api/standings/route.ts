import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sportId = searchParams.get('sport_id');

  try {
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
  } catch (error: any) {
    console.error('Standings API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

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
  } catch (error: any) {
    console.error('POST standings error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { id, ...updateData } = body;

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
  } catch (error: any) {
    console.error('PUT standings error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

