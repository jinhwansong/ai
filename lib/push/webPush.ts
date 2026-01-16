import webpush from 'web-push';
import { supabase } from '@/lib/supabase';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject =
  process.env.VAPID_SUBJECT || 'mailto:song7022556@gmail.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} else {
  console.warn('⚠️ VAPID keys not set. Push notifications will not work.');
}

export interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  user_agent?: string | null;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  data?: Record<string, unknown>;
}

/**
 * DB에서 모든 활성 구독 정보 조회
 */
export async function getAllSubscriptions(): Promise<PushSubscription[]> {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch subscriptions:', error);
    throw error;
  }

  return (data || []) as PushSubscription[];
}

/**
 * 단일 구독에 알림 전송
 */
export async function sendNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh_key,
        auth: subscription.auth_key,
      },
    };

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/icon-192x192.png',
      image: payload.image,
      data: {
        url: payload.url || '/',
        ...payload.data,
      },
    });

    await webpush.sendNotification(pushSubscription, notificationPayload);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to send notification to ${subscription.endpoint}:`, errorMessage);

    // 구독이 만료되었거나 유효하지 않은 경우 DB에서 삭제
    if (errorMessage.includes('410') || errorMessage.includes('expired')) {
      try {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
        console.log(`Removed expired subscription: ${subscription.endpoint}`);
      } catch (deleteError) {
        console.error('Failed to remove expired subscription:', deleteError);
      }
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * 모든 구독자에게 알림 전송 (배치)
 */
export async function sendNotificationToAll(
  payload: NotificationPayload
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const subscriptions = await getAllSubscriptions();
  const results = await Promise.allSettled(
    subscriptions.map((sub) => sendNotification(sub, payload))
  );

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      sent++;
    } else {
      failed++;
      const errorMsg =
        result.status === 'rejected'
          ? result.reason?.message || 'Unknown error'
          : result.value.error || 'Failed';
      errors.push(`Subscription ${index + 1}: ${errorMsg}`);
    }
  });

  console.log(`📤 Push notifications sent: ${sent} succeeded, ${failed} failed`);

  return { sent, failed, errors };
}
