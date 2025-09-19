import Typography from '@/components/common/Typography';
import CumulateTimes from '@/components/TimerPage/TimerTrends/CumulateTimes';
import Trends from '@/components/TimerPage/TimerTrends/Trends';
import UserMessage from '@/components/TimerPage/TimerTrends/UserMessage';
import i18n from '@/i18n';
import Session from '@/models/Session';
import TimerSession from '@/models/TimerSession';
import { useSessionCache } from '@/store/sessionCache';
import { Theme } from '@/styles/themes';
import { formatTimestampToHHMM, getToday } from '@/utils/time';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { generateSuggestion } from '../utils/generateSuggestion';
import { toUserMessage } from '../utils/toUserMessage';
import FocusRecords, { FocusRecordItem } from './FocusRecords';

type TimerHistoryItem = FocusRecordItem;

// 요일 이름 매핑
const getDayOfWeekName = (timestamp: number, locale: string): string => {
  const dayInKorean = ['일', '월', '화', '수', '목', '금', '토'];
  const dayInEnglish = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const date = new Date(timestamp);
  const dayIndex = date.getDay();

  return locale === 'ko' ? dayInKorean[dayIndex] : dayInEnglish[dayIndex];
};

// 날짜 포맷팅 (MM/DD)
const formatDateToMmDd = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
};

function TimerTrends({
  session,
  t,
  theme,
}: {
  session: Session;
  t: TFunction;
  theme: Theme;
}) {
  const { t: tTimer } = useTranslation('suggestion');

  const [userMessage, setUserMessage] = useState<string>(t('noDataMessage'));

  const sessions = useSessionCache((s) => s.sessionCache);

  const [timerHistory, setTimerHistory] = useState<TimerHistoryItem[]>([]);
  const [allTimerSessions, setAllTimerSessions] = useState<TimerHistoryItem[]>(
    [],
  );
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    setUserMessage(
      toUserMessage(
        generateSuggestion(session),
        getToday(i18n.language),
        tTimer,
      ),
    );

    const historyItems: TimerHistoryItem[] = [];
    const sessionsArr = Object.values(sessions);

    // 모든 타이머 세션을 수집하고 시간순으로 정렬
    const allSessionsData: {
      timerSession: TimerSession;
      sessionName: string;
    }[] = [];

    for (const s of sessionsArr) {
      const timeRanges = Object.values(s.timerSessionsByTimeRange);
      for (const tr of timeRanges) {
        for (const timerSession of tr) {
          if (timerSession.startTs && timerSession.endTs) {
            allSessionsData.push({
              timerSession,
              sessionName: s.sessionName,
            });
          }
        }
      }
    }

    // 최신순으로 정렬 (endTs 기준)
    allSessionsData.sort(
      (a, b) => (b.timerSession.endTs || 0) - (a.timerSession.endTs || 0),
    );

    // 모든 타이머 세션을 히스토리 아이템으로 변환
    for (const item of allSessionsData) {
      const { timerSession } = item;

      const startTime = formatTimestampToHHMM(timerSession.startTs);
      const endTime = formatTimestampToHHMM(timerSession.endTs || 0);
      const dayOfWeek = getDayOfWeekName(timerSession.startTs, i18n.language);
      const dateStr = formatDateToMmDd(timerSession.startTs);

      historyItems.push({
        durationStr: `${startTime} - ${endTime}`,
        dayOfWeek,
        dateStr,
        timestamp: timerSession.startTs,
        durationMs: timerSession.targetDurationMs,
      });
    }

    setAllTimerSessions(historyItems);
    setDisplayCount(10); // 세션 데이터가 변경되면 표시 개수 초기화
  }, [session.totalNetFocusMs, sessions]);

  // displayCount에 따라 표시할 세션들을 필터링
  useEffect(() => {
    setTimerHistory(allTimerSessions.slice(0, displayCount));
  }, [allTimerSessions, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  return (
    <>
      <Trends theme={theme} t={t} />
      <CumulateTimes
        totalNetFocusMs={session.totalNetFocusMs}
        theme={theme}
        t={t}
      />
      <UserMessage theme={theme} t={t} userMessage={userMessage} />
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.pages.timer.slider.text.secondary }}
      >
        집중 기록
      </Typography>
      <FocusRecords
        items={timerHistory}
        remainingCount={Math.max(allTimerSessions.length - displayCount, 0)}
        onLoadMore={handleLoadMore}
        theme={theme}
      />
    </>
  );
}

export default TimerTrends;
