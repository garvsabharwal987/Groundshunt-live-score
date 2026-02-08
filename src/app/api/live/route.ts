import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUpcoming = searchParams.get('includeUpcoming') === 'true';

    const supabase = await createServerSupabaseClient();

    // Build query for live and optionally upcoming fixtures
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
      .order('match_date', { ascending: true });

    // Include both live and upcoming for admin live scoring page
    if (includeUpcoming) {
      query = query.in('status', ['live', 'upcoming']);
    } else {
      query = query.eq('status', 'live');
    }

    const { data: fixtures, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = fixtures?.map((d: any) => ({
      ...d,
      live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
    }));

    return NextResponse.json(formatted || []);
  } catch (error: any) {
    console.error('Get live error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
