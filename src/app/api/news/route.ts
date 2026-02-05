import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

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
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

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
  } catch (error: any) {
    console.error('Post news error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
