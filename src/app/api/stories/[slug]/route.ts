import { NextResponse } from 'next/server';
import { getStoryContentBySlug } from '@/lib/services/storyContentService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const content = await getStoryContentBySlug(slug);

  if (!content) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  return NextResponse.json(content);
}
