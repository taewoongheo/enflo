import { timestampToDayKey, yyyymmddToMdDot } from '@/utils/time';

// 0=Sun..6=Sat → 1=Mon..7=Sun
const toMon1Sun7 = (dow: number) => (dow === 0 ? 7 : dow);

// 기준 날짜가 속한 주의 '월요일(로컬 자정)'
export function startOfISOWeekLocal(ts: number): Date {
  const d = new Date(ts);

  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = toMon1Sun7(base.getDay());

  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() - (dow - 1),
  );
}

// 주간 기간 문자열 'MM.DD - MM.DD'
export function formatWeeklyPeriodStr(baseDateMs: number) {
  const mon = startOfISOWeekLocal(baseDateMs);
  const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);

  const monKey = String(timestampToDayKey(mon.getTime()));
  const sunKey = String(timestampToDayKey(sun.getTime()));

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(
      yyyymmddToMdDot(
        String(
          timestampToDayKey(
            new Date(
              mon.getFullYear(),
              mon.getMonth(),
              mon.getDate() + i,
            ).getTime(),
          ),
        ),
      ),
    );
  }

  return {
    first: yyyymmddToMdDot(monKey),
    last: yyyymmddToMdDot(sunKey),
    days,
  };
}

// 월간 기간 문자열 'YYYY.MM' 또는 'MM.01 - MM.31'
export function formatMonthlyPeriodStr(baseDateMs: number) {
  const d = new Date(baseDateMs);
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-based
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0); // 다음 달의 0일 = 이번 달 말일

  const firstKey = String(timestampToDayKey(first.getTime()));
  const lastKey = String(timestampToDayKey(last.getTime()));

  const days: string[] = [];
  for (let i = 0; i < last.getDate(); i++) {
    if (i % 7 !== 0) continue;

    days.push(
      yyyymmddToMdDot(
        String(timestampToDayKey(new Date(y, m, i + 1).getTime())),
      ),
    );
  }

  return {
    first: yyyymmddToMdDot(firstKey),
    last: yyyymmddToMdDot(lastKey),
    days,
  };
}

// 주간 네비게이션: ±7일
export function shiftWeeks(ts: number, deltaWeeks: number) {
  const d = new Date(ts);
  const snap = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const next = new Date(
    snap.getFullYear(),
    snap.getMonth(),
    snap.getDate() + deltaWeeks * 7,
  );
  return next.getTime();
}

// 월간 네비게이션: ±1개월 (중간 날짜로 이동 후 자정 스냅)
export function shiftMonths(ts: number, deltaMonths: number) {
  const d = new Date(ts);
  // 15일 같은 중간 날짜로 이동 => 말일 이슈 회피
  const mid = new Date(d.getFullYear(), d.getMonth(), 15);
  const moved = new Date(mid.getFullYear(), mid.getMonth() + deltaMonths, 15);
  // 베이스는 해당 달의 15일로 유지, 자정 스냅
  return new Date(
    moved.getFullYear(),
    moved.getMonth(),
    moved.getDate(),
  ).getTime();
}
