import { generateMainSuggestion } from '../components/MainPage/utils/generateMainSuggestion';
import { mockT } from './suggestionSimulation';

// 점수 구간별로 5개씩 메시지 생성 및 출력
function simulateMainSuggestion() {
  // eslint-disable-next-line no-console
  console.log('='.repeat(60));
  // eslint-disable-next-line no-console
  console.log('🎯 메인 페이지 제안 메시지 시뮬레이션');
  // eslint-disable-next-line no-console
  console.log('='.repeat(60));
  // eslint-disable-next-line no-console
  console.log();

  // 점수 구간: 0-20, 21-40, 41-60, 61-80, 81-100
  const scoreRanges = [
    { min: 0, max: 20, label: 'VERY_LOW (0-20)' },
    { min: 21, max: 40, label: 'LOW (21-40)' },
    { min: 41, max: 60, label: 'MEDIUM (41-60)' },
    { min: 61, max: 80, label: 'HIGH (61-80)' },
    { min: 81, max: 100, label: 'VERY_HIGH (81-100)' },
  ];

  scoreRanges.forEach((range, rangeIndex) => {
    // eslint-disable-next-line no-console
    console.log(`📊 ${range.label} 구간`);
    // eslint-disable-next-line no-console
    console.log('-'.repeat(40));

    // 각 구간에서 5개씩 메시지 생성
    for (let i = 0; i < 5; i++) {
      // 구간 내에서 랜덤한 점수 생성
      const score =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

      // 메시지 생성
      const message = generateMainSuggestion(score, mockT);

      // eslint-disable-next-line no-console
      console.log(`점수: ${score}`);
      // eslint-disable-next-line no-console
      console.log(`메시지: ${message}`);
      // eslint-disable-next-line no-console
      console.log();
    }

    // 구간 사이에 구분선 추가 (마지막 구간 제외)
    if (rangeIndex < scoreRanges.length - 1) {
      // eslint-disable-next-line no-console
      console.log('~'.repeat(60));
      // eslint-disable-next-line no-console
      console.log();
    }
  });

  // eslint-disable-next-line no-console
  console.log('='.repeat(60));
  // eslint-disable-next-line no-console
  console.log('✅ 시뮬레이션 완료');
  // eslint-disable-next-line no-console
  console.log('='.repeat(60));
}

// 시뮬레이션 실행
simulateMainSuggestion();
