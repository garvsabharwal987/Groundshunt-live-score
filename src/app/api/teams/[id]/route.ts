import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();

  // Optionally, you can add auth here
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing team id' }, { status: 400 });
  }

  const { error } = await supabase.from('teams').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
