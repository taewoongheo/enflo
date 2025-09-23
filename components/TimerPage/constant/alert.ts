export const TIMER_FINISH_ALERT_MESSAGE = [
  {
    title: (min: number) => `${min}분 몰입 완료`,
    message: (_min: number) => `엔트로피가 점점 낮아지고 있어요`,
  },
  {
    title: (min: number) => `${min}분 타이머 종료`,
    message: (min: number) => `${min}분 동안 엔트로피를 안정적으로 낮췄어요`,
  },
  {
    title: (min: number) => `${min}분 몰입 성공`,
    message: (min: number) => `${min}분 동안 엔트로피가 낮게 유지됐어요`,
  },
  {
    title: (min: number) => `${min}분 타이머 종료`,
    message: (_min: number) => `이제 잠시 휴식을 취해보세요`,
  },
  {
    title: (min: number) => `${min}분 타이머 종료`,
    message: (_min: number) => `엔트로피가 점점 낮아지고 있어요`,
  },
  {
    title: (min: number) => `${min}분 몰입 성공`,
    message: (_min: number) => `이제 잠시 휴식을 취해보세요`,
  },
] as const;
