import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { sendNotificationToAll } from '@/lib/push/webPush';
import { redis } from '@/lib/core/redis';

/**
 * 웹 푸시 알림 전송 API
 * - Serverless 환경에서 외부 cron/webhook으로 호출 가능
 * - 인증: CRON_SECRET Bearer 토큰 필요
 */
export const POST = verifyCronAuth(async (req: NextRequest) => {
  try {
    // 요청 본문에서 커스텀 메시지 받기 (선택사항)
    let body: { title?: string; body?: string; url?: string } | null = null;
    try {
      body = (await req.json()) as { title?: string; body?: string; url?: string } | null;
    } catch {
      // 본문이 없거나 JSON이 아닌 경우 무시
    }

    // Redis에서 최신 브리핑 데이터 가져오기 (없으면 기본 메시지)
    const latestBriefing = await redis.get('dashboard:latest');
    let notificationPayload: {
      title: string;
      body: string;
      url: string;
      icon: string;
      badge: string;
    };

    if (latestBriefing && !body) {
      // 자동: 최신 브리핑 기반 알림
      const briefing = JSON.parse(latestBriefing);
      const signal = briefing.signal || {};

      notificationPayload = {
        title: '📊 오늘의 시장 브리핑',
        body: `${signal.focus || '새로운 시장 분석이 준비되었습니다'}\n${signal.description || '지금 확인해보세요!'}`,
        url: '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      };
    } else {
      // 수동: 커스텀 메시지 또는 기본 메시지
      notificationPayload = {
        title: body?.title || '📊 시장 분석 업데이트',
        body: body?.body || '새로운 시장 분석이 준비되었습니다. 지금 확인해보세요!',
        url: body?.url || '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      };
    }

    const result = await sendNotificationToAll(notificationPayload);

    return NextResponse.json({
      success: true,
      message: 'Push notifications sent',
      stats: {
        sent: result.sent,
        failed: result.failed,
        total: result.sent + result.failed,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Send Push Notifications] Failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});

/**
 * GET 요청도 지원 (간단한 트리거용)
 */
export const GET = verifyCronAuth(async () => {
  return POST(new NextRequest('http://localhost/api/internal/send-push-notifications', { method: 'POST' }));
});
