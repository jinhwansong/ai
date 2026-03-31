import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { pushUnsubscribeBodySchema } from '@/lib/validation/schemas';
import { jsonValidationError } from '@/lib/validation/zodRoute';

export async function POST(req: NextRequest) {
  try {
    const parsed = pushUnsubscribeBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const body = parsed.data;

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', body.endpoint);

    if (error) {
      console.error('Failed to delete push subscription:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscription', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully',
    });
  } catch (error) {
    console.error('Push unsubscribe API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
