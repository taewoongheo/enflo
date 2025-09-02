import { useMemo, useState } from 'react';
import { PERIOD } from '../constants/period';
import {
  formatMonthlyPeriodStr,
  formatWeeklyPeriodStr,
  shiftMonths,
  shiftWeeks,
  startOfISOWeekLocal,
} from '../utils/dateHelpers';

export default function usePeriodNavigation() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    (typeof PERIOD)[keyof typeof PERIOD]
  >(PERIOD.WEEKLY);

  const [baseDateMs, setBaseDateMs] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  });

  const isNextAvailable = useMemo(() => {
    if (selectedPeriod === PERIOD.WEEKLY) {
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
    return selectedPeriod === PERIOD.WEEKLY
      ? formatWeeklyPeriodStr(baseDateMs)
      : formatMonthlyPeriodStr(baseDateMs);
  }, [baseDateMs, selectedPeriod]);

  const handleTogglePeriod = (period: (typeof PERIOD)[keyof typeof PERIOD]) => {
    if (period === selectedPeriod) {
      return;
    }
    setSelectedPeriod(period);
    setBaseDateMs(new Date().getTime());
  };

  const handlePrev = () => {
    const next =
      selectedPeriod === PERIOD.WEEKLY
        ? shiftWeeks(baseDateMs, -1)
        : shiftMonths(baseDateMs, -1);
    setBaseDateMs(next);
  };

  const handleNext = () => {
    const next =
      selectedPeriod === PERIOD.WEEKLY
        ? shiftWeeks(baseDateMs, +1)
        : shiftMonths(baseDateMs, +1);
    setBaseDateMs(next);
  };

  return {
    selectedPeriod,
    baseDateMs,
    periodStr,
    isNextAvailable,
    handleTogglePeriod,
    handlePrev,
    handleNext,
  };
}
