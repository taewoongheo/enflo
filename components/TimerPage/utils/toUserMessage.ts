import { LEVEL_LABELS, TREND_LABELS } from '../constant/suggestion';
import { Level, Suggestion, Trend } from '../types/Suggestion';

export function toUserMessage(
  s: Suggestion | null,
  weekday: string,
  t: (key: string, options?: any) => any,
) {
  if (!s) {
    return t('noDataMessage');
  }

  const { timeRange } = s.rationale;
  const { score, label, trend, interruptionStats } = s;

  const headerVariations = t('headerVariations', {
    returnObjects: true,
  }) as string[];
  const timeRangeLabel = t(`timeRanges.${timeRange}`);

  const randomHeader =
    headerVariations[Math.floor(Math.random() * headerVariations.length)];
  const header = randomHeader
    .replace('{{weekday}}', weekday)
    .replace('{{timeRange}}', timeRangeLabel);

  const statusMessage = getStatusMessage(label, t);

  const actionMessage = getActionMessage(
    score,
    label,
    trend,
    interruptionStats,
    t,
  );

  let but = false;
  if (
    (label === LEVEL_LABELS.DANGER || label === LEVEL_LABELS.UNSTABLE) &&
    trend === TREND_LABELS.RISING
  ) {
    but = true;
  } else if (
    (label === LEVEL_LABELS.STABLE || label === LEVEL_LABELS.GOOD) &&
    trend === TREND_LABELS.DECLINING
  ) {
    but = true;
  }

  if (score < 30) {
    but = false;
  }

  const conjunction = but
    ? (() => {
        const butOptions = t('conjunctions.but', {
          returnObjects: true,
        }) as string[];
        return butOptions[Math.floor(Math.random() * butOptions.length)];
      })()
    : t('conjunctions.normal');
  return `${header}${statusMessage}${conjunction}${actionMessage}`;
}

function getStatusMessage(
  label: Level,
  t: (key: string, options?: any) => any,
): string {
  let statusKey: string;

  if (label === LEVEL_LABELS.DANGER) {
    statusKey = 'danger';
  } else if (label === LEVEL_LABELS.UNSTABLE) {
    statusKey = 'unstable';
  } else if (label === LEVEL_LABELS.STABLE) {
    statusKey = 'stable';
  } else {
    statusKey = 'good';
  }

  const messages = t(`statusMessages.${statusKey}`, {
    returnObjects: true,
  }) as string[];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getActionMessage(
  score: number,
  label: Level,
  trend: Trend,
  interruptionStats: Suggestion['interruptionStats'],
  t: (key: string, options?: any) => any,
): string {
  if (score >= 85) {
    const messages = t('actionMessages.excellent', {
      returnObjects: true,
    }) as string[];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (score >= 70) {
    const minorIssues = getSignificantInterruptions(interruptionStats, 0.2);

    if (minorIssues.length === 0) {
      if (trend === TREND_LABELS.RISING) {
        const messages = t('actionMessages.risingStable', {
          returnObjects: true,
        }) as string[];
        return messages[Math.floor(Math.random() * messages.length)];
      } else {
        const messages = t('actionMessages.stableHigh', {
          returnObjects: true,
        }) as string[];
        return messages[Math.floor(Math.random() * messages.length)];
      }
    } else {
      const issueName = t(`interruptions.${minorIssues[0].name}`);
      const messages = t('actionMessages.minorImprovement', {
        returnObjects: true,
      }) as string[];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      return randomMessage.replace('{{issue}}', issueName);
    }
  }

  if (score >= 30) {
    const issues = getSignificantInterruptions(interruptionStats, 0.2);

    if (trend === TREND_LABELS.RISING) {
      if (issues.length === 0) {
        const messages = t('actionMessages.risingMedium', {
          returnObjects: true,
        }) as string[];
        return messages[Math.floor(Math.random() * messages.length)];
      } else if (issues.length === 1) {
        const issueName = t(`interruptions.${issues[0].name}`);
        const messages = t('actionMessages.risingWithTip', {
          returnObjects: true,
        }) as string[];
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        return randomMessage
          .replace('{{issue}}', issueName)
          .replace('{{count}}', issues[0].count.toFixed(1));
      } else {
        const issueName = t(`interruptions.${issues[0].name}`);
        const messages = t('actionMessages.risingMultiTip', {
          returnObjects: true,
        }) as string[];
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        return randomMessage
          .replace('{{issue}}', issueName)
          .replace('{{count}}', issues[0].count.toFixed(1));
      }
    }

    if (issues.length === 0) {
      const messages = t('actionMessages.noIssue', {
        returnObjects: true,
      }) as string[];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (issues.length === 1) {
      const issueName = t(`interruptions.${issues[0].name}`);
      const messages = t('actionMessages.singleIssue', {
        returnObjects: true,
      }) as string[];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      return randomMessage
        .replace('{{issue}}', issueName)
        .replace('{{count}}', issues[0].count.toFixed(1));
    } else {
      const issue1Name = t(`interruptions.${issues[0].name}`);
      const issue2Name = t(`interruptions.${issues[1].name}`);
      const messages = t('actionMessages.multiIssue', {
        returnObjects: true,
      }) as string[];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      return randomMessage
        .replace('{{issue1}}', issue1Name)
        .replace('{{count1}}', issues[0].count.toFixed(1))
        .replace('{{issue2}}', issue2Name)
        .replace('{{count2}}', issues[1].count.toFixed(1));
    }
  }

  const issues = getSignificantInterruptions(interruptionStats, 0.2);
  if (issues.length === 0) {
    const messages = t('actionMessages.lowScoreNoIssue', {
      returnObjects: true,
    }) as string[];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const topIssue = issues[0];
    const issueName = t(`interruptions.${topIssue.name}`);
    const messages = t('actionMessages.lowScoreWithIssue', {
      returnObjects: true,
    }) as string[];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return randomMessage
      .replace('{{issue}}', issueName)
      .replace('{{count}}', topIssue.count.toFixed(1));
  }
}

function getSignificantInterruptions(
  interruptionStats: Suggestion['interruptionStats'],
  threshold: number,
): { name: string; count: number }[] {
  return Object.values(interruptionStats)
    .filter((stat) => stat.count >= threshold)
    .sort((a, b) => b.count - a.count);
}
