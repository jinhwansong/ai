import { redis } from '@/lib/redis/redis';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { tag: string } }
) {
  const { tag } = params;

  const cached = await redis.get(`keyword:${tag}`);

  if (!cached) {
    return NextResponse.json(
      { error: 'keyword result not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(JSON.parse(cached));
}
