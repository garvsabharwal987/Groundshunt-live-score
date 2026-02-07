import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('news_of_the_day')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const body = await request.json();

    // Map old column names to new Supabase schema names
    const updateData: Record<string, any> = {};
    
    // Map fields from request body to Supabase schema
    if ('featured_image_url' in body) updateData.image_url = body.featured_image_url;
    if ('image_url' in body) updateData.image_url = body.image_url;
    if ('is_published' in body) updateData.is_featured = body.is_published;
    if ('is_featured' in body) updateData.is_featured = body.is_featured;
    if ('publish_date' in body) updateData.published_at = body.publish_date;
    if ('published_at' in body) updateData.published_at = body.published_at;
    if ('title' in body) updateData.title = body.title;
    if ('description' in body) updateData.description = body.description;
    if ('content' in body) updateData.content = body.content;
    if ('sport_id' in body) updateData.sport_id = body.sport_id;

    const { data, error } = await supabase
      .from('news_of_the_day')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('News PUT error:', error);
      const errorMsg = typeof error === 'object' && error !== null ? (error as any).message || JSON.stringify(error) : String(error);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Put news error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('news_of_the_day')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
