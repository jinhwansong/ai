import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

export function getDailyBriefingMeta() {
  const now = toZonedTime(new Date(), TIMEZONE);

  const hour = Number(format(now, 'HH'));
  let publishTime: '09:00 AM' | '12:00 PM' | '18:00 PM' | '21:00 PM';
if (hour >= 21) {
  publishTime = '21:00 PM';
} else if (hour >= 18) {
  publishTime = '18:00 PM';
} else if (hour >= 12) {
  publishTime = '12:00 PM';
} else if (hour >= 9) {
  publishTime = '09:00 AM';
} else {
  publishTime = '21:00 PM';
}
  return {
    publishTime,
  };
}

