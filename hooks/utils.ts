export function formatDate(date: Date = new Date()) {
  return date.toISOString().split('T')[0];
}
