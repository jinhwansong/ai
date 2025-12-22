import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

export function getDailyBriefingMeta() {
  const now = toZonedTime(new Date(), TIMEZONE);

  const hour = Number(format(now, 'HH'));
  let publishTime = '09:00';
  if (hour >= 12 && hour < 18) publishTime = '12:00';
  else if (hour >= 18 && hour < 21) publishTime = '18:00';
  else if (hour >= 21) publishTime = '21:00';

  const date = format(now, 'yyyy-MM-dd');
  const compact = format(now, 'yyyyMMdd');
  const timeKey = publishTime.replace(':', '');

  return {
    id: `daily-${compact}-${timeKey}`,
    date,
    publishTime,
  };
}
