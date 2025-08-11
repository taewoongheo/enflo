import { LEVEL_LABELS, TREND_LABELS } from '../constant/suggestion';
import { Level, Suggestion, Trend } from '../types/Suggestion';

const TIME_RANGES = {
  '00-03': '늦은 밤',
  '03-06': '새벽',
  '06-09': '이른 아침',
  '09-12': '오전',
  '12-15': '오후',
  '15-18': '늦은 오후',
  '18-21': '저녁',
  '21-24': '늦은 저녁',
} as const;

export function toUserMessage(s: Suggestion | null, weekdayKo: string) {
  if (!s) {
    return '아직은 당신만의 집중 패턴을 알아가는 중이에요. 조금만 더 기록을 쌓으면 맞춤형 집중 패턴 분석을 제공해드립니다.';
  }

  const { timeRange } = s.rationale;
  const { score, label, trend, interruptionStats } = s;

  const headerVariations = [
    `최근 ${weekdayKo} ${TIME_RANGES[timeRange]} 시간대에선 `,
    `${weekdayKo} ${TIME_RANGES[timeRange]} 시간대에는 `,
    `지난 ${weekdayKo} ${TIME_RANGES[timeRange]} 시간대의 집중력 분석 결과, `,
    `${weekdayKo} ${TIME_RANGES[timeRange]} 시간대의 집중력은 `,
    `최근 ${weekdayKo} ${TIME_RANGES[timeRange]} 시간대 집중 패턴을 보면 `,
    `${weekdayKo} ${TIME_RANGES[timeRange]} 시간대의 집중력을 살펴보면 `,
  ];
  const header =
    headerVariations[Math.floor(Math.random() * headerVariations.length)];

  const statusMessage = getStatusMessage(label);

  const actionMessage = getActionMessage(
    score,
    label,
    trend,
    interruptionStats,
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

  return `${header}${statusMessage}${but ? ' 하지만 ' : ' '}${actionMessage}`;
}

function getStatusMessage(label: Level): string {
  if (label === LEVEL_LABELS.DANGER) {
    const messages = [
      '집중 실패 위험이 높아요.',
      '집중력이 많이 부족해요.',
      '집중하기 어려운 상태예요.',
      '집중이 잘 안 되고 있어요.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (label === LEVEL_LABELS.UNSTABLE) {
    const messages = [
      '집중 유지가 불안정해요.',
      '집중력이 일정하지 않아요.',
      '집중 상태가 들쭉날쭉해요.',
      '집중력에 기복이 있어요.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (label === LEVEL_LABELS.STABLE) {
    const messages = [
      '집중 유지가 안정적이에요.',
      '집중 상태가 괜찮아요.',
      '집중력이 꽤 좋은 편이에요.',
      '집중을 잘 유지하고 있어요.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = [
      '집중 상태가 아주 좋아요.',
      '집중력이 뛰어나요.',
      '집중을 완벽하게 하고 있어요.',
      '집중 컨디션이 최고예요.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

function getActionMessage(
  score: number,
  label: Level,
  trend: Trend,
  interruptionStats: Suggestion['interruptionStats'],
): string {
  if (score >= 85) {
    const encouragements = [
      '완벽해요! 지금 집중 패턴을 계속 유지해보세요.',
      '훌륭합니다! 이런 흐름을 이어가세요.',
      '최고의 집중 상태네요! 계속 이어가세요.',
      '정말 대단해요! 이 상태를 계속 유지하세요.',
      '완벽한 집중력이에요! 지금처럼 계속해주세요.',
      '놀라워요! 이런 집중 패턴을 유지해보세요.',
      '최상의 컨디션이네요! 계속 이어나가세요.',
      '완벽한 몰입이에요! 현재 패턴을 유지하세요.',
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  if (score >= 70) {
    const minorIssues = getSignificantInterruptions(interruptionStats, 0.2); // 더 관대한 기준

    if (minorIssues.length === 0) {
      if (trend === TREND_LABELS.RISING) {
        const risingMessages = [
          '점점 더 좋아지고 있어요! 이대로 계속하세요.',
          '멋진 상승세네요! 계속 발전해 나가세요.',
          '좋은 방향으로 발전하고 있어요! 이대로 계속하세요.',
          '개선된 방향으로 나아가고 있어요! 이대로 계속하세요.',
        ];
        return risingMessages[
          Math.floor(Math.random() * risingMessages.length)
        ];
      } else {
        const stableMessages = [
          '안정적인 집중 상태를 잘 유지하고 있어요.',
          '좋은 집중력을 꾸준히 유지하고 있네요.',
          '집중 상태가 안정적으로 유지되고 있어요.',
          '꾸준한 집중력을 보여주고 있어요.',
        ];
        return stableMessages[
          Math.floor(Math.random() * stableMessages.length)
        ];
      }
    } else {
      const improvementMessages = [
        `전반적으로 좋습니다. 다만, ${minorIssues[0].name}만 조금 줄이면 더욱 완벽해질 거예요.`,
        `거의 완벽해요! ${minorIssues[0].name}만 조금 개선하면 완벽할 거예요.`,
        `정말 좋아요! ${minorIssues[0].name}를 조금만 줄이면 더 완벽해질 거예요.`,
        `훌륭한 상태예요! ${minorIssues[0].name}만 개선하면 완벽할 거예요.`,
      ];
      return improvementMessages[
        Math.floor(Math.random() * improvementMessages.length)
      ];
    }
  }

  if (score >= 30) {
    const issues = getSignificantInterruptions(interruptionStats, 0.2);

    if (trend === TREND_LABELS.RISING) {
      if (issues.length === 0) {
        const risingMessages = [
          '점점 나아지고 있어요! 이 방향으로 계속 개선해보세요.',
          '좋은 방향으로 발전하고 있어요! 계속 이어가세요.',
          '개선되고 있는 모습이 보여요! 이대로 계속하세요.',
          '발전하는 모습이 멋져요! 꾸준히 개선해나가세요.',
        ];
        return risingMessages[
          Math.floor(Math.random() * risingMessages.length)
        ];
      } else if (issues.length === 1) {
        const risingWithTipMessages = [
          `점점 나아지고 있어요! '${issues[0].name}'를 더 줄여보세요. (평균 ${issues[0].count.toFixed(1)}회)`,
          `좋은 방향이에요! '${issues[0].name}'를 더 개선해보세요. (평균 ${issues[0].count.toFixed(1)}회)`,
          `발전하고 있어요! '${issues[0].name}'를 조금 더 줄여보세요. (평균 ${issues[0].count.toFixed(1)}회)`,
          `개선되고 있네요! '${issues[0].name}'에 더 신경써보세요. (평균 ${issues[0].count.toFixed(1)}회)`,
        ];
        return risingWithTipMessages[
          Math.floor(Math.random() * risingWithTipMessages.length)
        ];
      } else {
        const risingMultiTipMessages = [
          `점점 나아지고 있어요! '${issues[0].name}'(${issues[0].count.toFixed(1)}회)를 더 줄여보세요.`,
          `좋은 방향으로 나아가고 있어요! '${issues[0].name}'(${issues[0].count.toFixed(1)}회)를 개선해보세요.`,
          `발전하고 있어요! '${issues[0].name}'(${issues[0].count.toFixed(1)}회)에 집중해보세요.`,
        ];
        return risingMultiTipMessages[
          Math.floor(Math.random() * risingMultiTipMessages.length)
        ];
      }
    }

    if (issues.length === 0) {
      const noIssueMessages = [
        '큰 방해 요소는 없지만, 집중 시간을 조금 더 늘려보세요.',
        '방해 요소는 적어요. 조금 더 긴 집중을 도전해보세요.',
        '방해받는 일은 적네요. 집중 시간을 늘려볼 때예요.',
        '큰 문제는 없어요. 더 오래 집중해보는 것을 목표로 해보세요.',
      ];
      return noIssueMessages[
        Math.floor(Math.random() * noIssueMessages.length)
      ];
    } else if (issues.length === 1) {
      const singleIssueMessages = [
        `주로 '${issues[0].name}' 때문에 집중이 방해받고 있어요. (평균 ${issues[0].count.toFixed(1)}회)`,
        `'${issues[0].name}'가 집중을 방해하고 있네요. (평균 ${issues[0].count.toFixed(1)}회)`,
        `'${issues[0].name}' 때문에 집중이 흐트러지고 있어요. (평균 ${issues[0].count.toFixed(1)}회)`,
        `가장 큰 방해 요소는 '${issues[0].name}'이에요. (평균 ${issues[0].count.toFixed(1)}회)`,
      ];
      return singleIssueMessages[
        Math.floor(Math.random() * singleIssueMessages.length)
      ];
    } else {
      const multiIssueMessages = [
        `'${issues[0].name}'(평균 ${issues[0].count.toFixed(1)}회)와 '${issues[1].name}'(평균 ${issues[1].count.toFixed(1)}회)을 줄여보세요.`,
        `'${issues[0].name}'(평균 ${issues[0].count.toFixed(1)}회)와 '${issues[1].name}'(평균 ${issues[1].count.toFixed(1)}회)를 개선해보세요.`,
        `'${issues[0].name}'(평균 ${issues[0].count.toFixed(1)}회)와 '${issues[1].name}'(평균 ${issues[1].count.toFixed(1)}회)에 신경써보세요.`,
      ];
      return multiIssueMessages[
        Math.floor(Math.random() * multiIssueMessages.length)
      ];
    }
  }

  const issues = getSignificantInterruptions(interruptionStats, 0.2);
  if (issues.length === 0) {
    const lowScoreNoIssueMessages = [
      '집중 시간이 부족해요. 조금씩 시간을 늘려보는 것부터 시작해보세요.',
      '짧은 집중이 반복되고 있어요. 조금씩 더 오래 집중해보세요.',
      '집중 지속 시간을 늘려볼 필요가 있어요. 단계적으로 개선해보세요.',
      '더 긴 집중이 필요해요. 천천히 시간을 늘려가보세요.',
    ];
    return lowScoreNoIssueMessages[
      Math.floor(Math.random() * lowScoreNoIssueMessages.length)
    ];
  } else {
    const topIssue = issues[0];
    const lowScoreWithIssueMessages = [
      `주요 방해 요소는 '${topIssue.name}'입니다. (평균 ${topIssue.count.toFixed(1)}회) 이를 줄이는데 집중해보세요.`,
      `'${topIssue.name}'가 가장 큰 문제예요. (평균 ${topIssue.count.toFixed(1)}회) 이 부분부터 개선해보세요.`,
      `집중을 가장 방해하는 건 '${topIssue.name}'이에요. (평균 ${topIssue.count.toFixed(1)}회) 우선 이것부터 줄여보세요.`,
      `'${topIssue.name}' 때문에 집중이 어려워요. (평균 ${topIssue.count.toFixed(1)}회) 이 문제부터 해결해보세요.`,
    ];
    return lowScoreWithIssueMessages[
      Math.floor(Math.random() * lowScoreWithIssueMessages.length)
    ];
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
