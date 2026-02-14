import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const sportSlug = url.searchParams.get('sport');

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

    // Filter by sport slug if provided
    if (sportSlug) {
      // First get the sport ID by slug
      const { data: sportData } = await supabase
        .from('sports')
        .select('id')
        .eq('slug', sportSlug)
        .single();
      
      if (sportData) {
        query = query.eq('sport_id', sportData.id);
      }
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
  } catch (error: any) {
    console.error('Get fixtures error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('fixtures')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Fixture POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
