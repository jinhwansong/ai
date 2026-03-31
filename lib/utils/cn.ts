import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx + tailwind-merge — className 조합은 여기만 경유 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
