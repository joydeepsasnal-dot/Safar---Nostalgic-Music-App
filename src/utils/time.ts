import { ClockFormat, DateFormat, SecondsStyle } from '../types/index.ts';

/**
 * Formats time parts from a Date object into hours, minutes, seconds, and period (AM/PM)
 */
export function getTimeParts(date: Date, format: ClockFormat = '24h') {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let period = '';

  if (format === '12h') {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
  }

  const paddedHours = hours.toString().padStart(format === '24h' ? 2 : 1, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return {
    hours: paddedHours,
    minutes: paddedMinutes,
    seconds: paddedSeconds,
    period,
  };
}

/**
 * Formats date into human-readable representations
 */
export function formatDate(date: Date, format: DateFormat = 'full'): string {
  if (format === 'none') return '';

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayOfWeek = dayNames[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const shortMonthName = monthName.slice(0, 3);
  const year = date.getFullYear();

  switch (format) {
    case 'full':
      return `${dayOfWeek}, ${dayOfMonth} ${monthName} ${year}`;
    case 'short':
      return `${dayOfWeek.slice(0, 3)}, ${dayOfMonth} ${shortMonthName}`;
    case 'compact':
      return `${dayOfMonth.toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${year}`;
    case 'iso':
      return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`;
    default:
      return `${dayOfMonth} ${shortMonthName} ${year}`;
  }
}

/**
 * Formats a duration in seconds to M:SS or H:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
