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
      .order('published_at', { ascending: false });

    // For admin, show all news; for users, only featured ones
    if (!showAll) {
      query = query.eq('is_featured', true).limit(20);
    }

    const { data, error } = await query;

    if (error) {
      console.error('News API error:', error);
      const errorMsg = typeof error === 'object' && error !== null ? (error as any).message || JSON.stringify(error) : String(error);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get news error:', error);
    console.error('Error details:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    // Map old column names to new Supabase schema names
    const insertData: Record<string, any> = {
      title: body.title,
    };
    
    // Map description (new schema) or content (old)
    if ('description' in body) insertData.description = body.description;
    else if ('content' in body) insertData.description = body.content; // fallback
    
    // Also include content if provided
    if ('content' in body) insertData.content = body.content;
    
    // Map image_url - handle both old (featured_image_url) and new names
    if ('featured_image_url' in body) insertData.image_url = body.featured_image_url;
    else if ('image_url' in body) insertData.image_url = body.image_url;
    
    // Map is_featured - handle both old (is_published) and new names
    if ('is_published' in body) insertData.is_featured = body.is_published;
    else if ('is_featured' in body) insertData.is_featured = body.is_featured;
    else insertData.is_featured = false;
    
    // Optional fields
    if ('sport_id' in body) insertData.sport_id = body.sport_id;

    const { data, error } = await supabase
      .from('news_of_the_day')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('News POST error:', error);
      const errorMsg = typeof error === 'object' && error !== null ? (error as any).message || JSON.stringify(error) : String(error);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Post news error:', error);
    console.error('Error details:', error?.message, error?.stack);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
