import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
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
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

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
  } catch (error: any) {
    console.error('Put live score error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
