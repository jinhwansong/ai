import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    const cachedData = await redis.get('dashboard:latest');
    
    if (!cachedData) {
      return NextResponse.json(
        { error: 'No signal data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    
    const signal = dashboard.signal;

    const signalData = {
      focus: signal?.focus || '전략적 시장 분석 완료',
      description: signal?.description || '현재 시장 상황을 기반으로 한 AI 분석 시그널입니다.',
      value: signal?.value || '70',
      change: signal?.change || '보합',
      impactZones: signal?.impactZones || [
        { label: '채권/금리', status: '중립' },
        { label: '기술주', status: '강세' },
        { label: '달러/환율', status: '약세' },
      ],
      tags: signal?.tags || ['시장분석'],
      updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    return NextResponse.json(signalData);
  } catch (error) {
    console.error('Signal API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
