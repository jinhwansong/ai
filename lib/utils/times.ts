import { format, formatDistanceToNow } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ko } from 'date-fns/locale';

const TIMEZONE = 'Asia/Seoul';

export function getDailyBriefingMeta() {
  const now = toZonedTime(new Date(), TIMEZONE);
  const date = format(now, 'yyyy-MM-dd');
  const hour = Number(format(now, 'HH'));
  let publishTime: '08:30 AM' | '14:00 PM' | '18:00 PM'
if (hour >= 18) {
  publishTime = '18:00 PM';
} else if (hour >= 14) {
  publishTime = '14:00 PM';
} else {
  publishTime = '08:30 AM';
}
  return {
    date,
    publishTime,
  };
}



export function formatPublishedAt(publishedAt: string) {
  return formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: ko,
  });
}