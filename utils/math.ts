export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const trimmedMean = (values: number[], trimRatio = 0.1) => {
  const n = values.length;
  if (n === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(n * trimRatio);

  // trim the values
  const trimmed = sorted.slice(trimCount, n - trimCount);
  if (trimmed.length === 0) return null;

  const sum = trimmed.reduce((acc, val) => acc + val, 0);
  return sum / trimmed.length;
};
