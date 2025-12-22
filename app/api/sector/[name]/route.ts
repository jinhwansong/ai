import { redis } from '@/lib/redis/redis';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const cached = await redis.get(`sector:${name}`);
  if (!cached) {
    return NextResponse.json(
      {
        error: 'Sector not found',
      },
      { status: 404 }
    );
  }
  return NextResponse.json(JSON.parse(cached));
}
