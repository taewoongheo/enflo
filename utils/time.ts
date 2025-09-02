export function formatMsToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatMsToMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getToday(locale: string) {
  const dayInKorean = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayInEnglish = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const today = new Date();
  const day = today.getDay();
  const dayName = locale === 'ko' ? dayInKorean[day] : dayInEnglish[day];
  return dayName;
}

export const formatTimestampToHHMM = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Convert timestamp to dayKey format (YYYYMMDD)
 */
export const timestampToDayKey = (timestamp: number): number => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year * 10000 + month * 100 + day;
};

/**
 * Convert timestamp to weekKey format (YYYYWW)
 */
export const timestampToWeekKey = (timestamp: number): number => {
  const d = new Date(timestamp);
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate()); // local midnight

  let dow = date.getDay();
  if (dow === 0) dow = 7;
  date.setDate(date.getDate() + (4 - dow));

  const weekYear = date.getFullYear();

  const jan4 = new Date(weekYear, 0, 4); // local
  const jan4Dow = jan4.getDay() || 7; // 1..7 (Sun→7)
  const week1Monday = new Date(weekYear, 0, 4 - (jan4Dow - 1)); // local Monday

  const daysDiff = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(
        week1Monday.getFullYear(),
        week1Monday.getMonth(),
        week1Monday.getDate(),
      )) /
      86400000,
  );

  const weekNumber = Math.floor(daysDiff / 7) + 1;

  return weekYear * 100 + weekNumber;
};

/**
 * Convert timestamp to monthKey format (YYYYMM)
 */
export const timestampToMonthKey = (timestamp: number): number => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return year * 100 + month;
};

/**
 * Convert timestamp to yearKey format (YYYY)
 */
export const timestampToYearKey = (timestamp: number): number => {
  const date = new Date(timestamp);
  return date.getFullYear();
};

// YYYYMMDD → 'MM.DD'
export function yyyymmddToMdDot(yyyymmdd: string) {
  return `${yyyymmdd.substring(4, 6)}.${yyyymmdd.substring(6, 8)}`;
}
