import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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

  const { error } = await supabase
    .from('fixtures')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
