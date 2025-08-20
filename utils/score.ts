export const normalizeScoreToEntropy = (score: number): string => {
  const calculatedScore = 1 - score / 100;
  const result = calculatedScore.toFixed(2);

  if (result.at(-1) === '0') {
    return calculatedScore.toFixed(1);
  }

  return result;
};
