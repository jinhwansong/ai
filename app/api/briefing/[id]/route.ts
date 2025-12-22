import { redis } from '@/lib/redis/redis';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cached = await redis.get(`briefing:${id}`);
  if (!cached) {
    return NextResponse.json(
      {
        error: 'Briefing not found',
      },
      { status: 404 }
    );
  }
  return NextResponse.json(JSON.parse(cached));
}
