import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { pushSubscriptionBodySchema } from '@/lib/validation/schemas';
import { jsonValidationError } from '@/lib/validation/zodRoute';

export async function POST(req: NextRequest) {
  try {
    const parsed = pushSubscriptionBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const body = parsed.data;

    // 중복 체크: endpoint 기준으로 upsert
    const subscriptionData = {
      endpoint: body.endpoint,
      p256dh_key: body.keys.p256dh,
      auth_key: body.keys.auth,
      user_agent: body.userAgent || null,
      user_id: body.userId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'endpoint',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save push subscription:', error);
      return NextResponse.json(
        { error: 'Failed to save subscription', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription saved successfully',
      id: data.id,
    });
  } catch (error) {
    console.error('Push subscription API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
