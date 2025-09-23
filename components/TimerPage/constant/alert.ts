export const getTimerFinishAlertMessages = (
  t: (key: string, options?: { min: number }) => string,
) =>
  [
    {
      title: (min: number) => t('timerFinishTitle1', { min }),
      message: (_min: number) => t('timerFinishMessage1'),
    },
    {
      title: (min: number) => t('timerFinishTitle2', { min }),
      message: (min: number) => t('timerFinishMessage2', { min }),
    },
    {
      title: (min: number) => t('timerFinishTitle3', { min }),
      message: (min: number) => t('timerFinishMessage3', { min }),
    },
    {
      title: (min: number) => t('timerFinishTitle4', { min }),
      message: (_min: number) => t('timerFinishMessage4'),
    },
    {
      title: (min: number) => t('timerFinishTitle5', { min }),
      message: (_min: number) => t('timerFinishMessage5'),
    },
    {
      title: (min: number) => t('timerFinishTitle6', { min }),
      message: (_min: number) => t('timerFinishMessage6'),
    },
  ] as const;
