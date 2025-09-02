import { baseTokens, Theme } from '@/styles';
import { timestampToDayKey, yyyymmddToMdDot } from '@/utils/time';
import { Entypo } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

// ───────────────────────── helpers (DST-safe: 달력 연산) ─────────────────────────

// 0=Sun..6=Sat → 1=Mon..7=Sun
const toMon1Sun7 = (dow: number) => (dow === 0 ? 7 : dow);

// 기준 날짜가 속한 주의 '월요일(로컬 자정)'
function startOfISOWeekLocal(ts: number): Date {
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
function formatWeeklyPeriodStr(baseDateMs: number) {
  const mon = startOfISOWeekLocal(baseDateMs);
  const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);

  const monKey = String(timestampToDayKey(mon.getTime()));
  const sunKey = String(timestampToDayKey(sun.getTime()));

  return `${yyyymmddToMdDot(monKey)} - ${yyyymmddToMdDot(sunKey)}`;
}

// 월간 기간 문자열 'YYYY.MM' 또는 'MM.01 - MM.31'
function formatMonthlyPeriodStr(baseDateMs: number) {
  const d = new Date(baseDateMs);
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-based
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0); // 다음 달의 0일 = 이번 달 말일

  const firstKey = String(timestampToDayKey(first.getTime()));
  const lastKey = String(timestampToDayKey(last.getTime()));

  return `${yyyymmddToMdDot(firstKey)} - ${yyyymmddToMdDot(lastKey)}`;
}

// 주간 네비게이션: ±7일
function shiftWeeks(ts: number, deltaWeeks: number) {
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
function shiftMonths(ts: number, deltaMonths: number) {
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

export default function EntropyTrendSection({ theme }: { theme: Theme }) {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>(
    'weekly',
  );

  const [baseDateMs, setBaseDateMs] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  });

  const isNextAvailable = useMemo(() => {
    if (selectedPeriod === 'weekly') {
      const nextWeekStart = startOfISOWeekLocal(
        shiftWeeks(baseDateMs, +1),
      ).getTime();

      const thisWeekStart = startOfISOWeekLocal(Date.now()).getTime();
      return nextWeekStart <= thisWeekStart;
    }

    // monthly
    const dNext = new Date(shiftMonths(baseDateMs, +1));
    const dNow = new Date();

    const nextYM = dNext.getFullYear() * 12 + dNext.getMonth();
    const nowYM = dNow.getFullYear() * 12 + dNow.getMonth();

    return nextYM <= nowYM;
  }, [baseDateMs, selectedPeriod]);

  const periodStr = useMemo(() => {
    return selectedPeriod === 'weekly'
      ? formatWeeklyPeriodStr(baseDateMs)
      : formatMonthlyPeriodStr(baseDateMs);
  }, [baseDateMs, selectedPeriod]);

  const handleTogglePeriod = (period: 'weekly' | 'monthly') => {
    if (period === selectedPeriod) {
      return;
    }
    setSelectedPeriod(period);
    setBaseDateMs(new Date().getTime());
  };

  const handlePrev = () => {
    const next =
      selectedPeriod === 'weekly'
        ? shiftWeeks(baseDateMs, -1)
        : shiftMonths(baseDateMs, -1);
    setBaseDateMs(next);
  };

  const handleNext = () => {
    const next =
      selectedPeriod === 'weekly'
        ? shiftWeeks(baseDateMs, +1)
        : shiftMonths(baseDateMs, +1);
    setBaseDateMs(next);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[3],
      }}
    >
      {/* 헤더: 타이틀 + 주/월 토글 */}
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.text.primary }}
        >
          엔트로피 변화
        </Typography>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: scale(1),
            borderColor: theme.colors.border,
            borderRadius: baseTokens.borderRadius.sm,
          }}
        >
          <Pressable
            onPress={() => handleTogglePeriod('weekly')}
            style={{
              backgroundColor:
                selectedPeriod === 'weekly'
                  ? theme.colors.pages.stats.toggle.selectedBackground
                  : 'transparent',
              paddingHorizontal: baseTokens.spacing[2],
              paddingVertical: baseTokens.spacing[1],
              borderTopLeftRadius: baseTokens.borderRadius.sm,
              borderBottomLeftRadius: baseTokens.borderRadius.sm,
            }}
          >
            <Typography
              variant="label"
              style={{ color: theme.colors.text.primary }}
            >
              주간
            </Typography>
          </Pressable>

          <Pressable
            onPress={() => handleTogglePeriod('monthly')}
            style={{
              backgroundColor:
                selectedPeriod === 'monthly'
                  ? theme.colors.pages.stats.toggle.selectedBackground
                  : 'transparent',
              paddingHorizontal: baseTokens.spacing[2],
              paddingVertical: baseTokens.spacing[1],
              borderTopRightRadius: baseTokens.borderRadius.sm,
              borderBottomRightRadius: baseTokens.borderRadius.sm,
            }}
          >
            <Typography
              variant="label"
              style={{ color: theme.colors.text.primary }}
            >
              월간
            </Typography>
          </Pressable>
        </View>
      </View>

      {/* 기간 내비 + 라벨 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: baseTokens.spacing[2],
          marginTop: baseTokens.spacing[2],
        }}
      >
        <Pressable onPress={handlePrev}>
          <Entypo
            name="chevron-thin-left"
            size={scale(15)}
            color={theme.colors.text.primary}
          />
        </Pressable>

        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          {periodStr}
        </Typography>

        {isNextAvailable && (
          <Pressable onPress={handleNext}>
            <Entypo
              name="chevron-thin-right"
              size={scale(15)}
              color={theme.colors.text.primary}
            />
          </Pressable>
        )}
      </View>

      {/* TODO: 실제 그래프 영역 */}
      {/* <View style={{ height: scale(160), marginTop: baseTokens.spacing[3] }}>...</View> */}
    </View>
  );
}
