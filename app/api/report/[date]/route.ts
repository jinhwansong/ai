import { NextResponse } from 'next/server';
import { getDailyReport } from '@/lib/redis/newsCache';

export async function GET(
  _req: Request,
  { params }: { params: { date: string } }
) {
  const report = await getDailyReport(params.date);

  if (!report) {
    return NextResponse.json({ error: 'report not found' }, { status: 404 });
  }

  return NextResponse.json(report);
}
