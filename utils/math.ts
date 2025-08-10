export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function mean(arr: number[]): number | null {
  if (arr.length === 0) {
    return null;
  }
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}

function iqrFilter(
  values: number[],
  k = 1.5,
): { filtered: number[]; removed: number } {
  const n = values.length;
  if (n === 0) return { filtered: [], removed: 0 };
  if (n < 4) return { filtered: [...values], removed: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  if (iqr === 0) return { filtered: sorted, removed: 0 };

  const lower = q1 - k * iqr;
  const upper = q3 + k * iqr;
  const filtered = sorted.filter((v) => v >= lower && v <= upper);

  if (filtered.length < Math.ceil(n / 2)) {
    return { filtered: sorted, removed: 0 };
  }

  return { filtered, removed: n - filtered.length };
}

export function iqrMean(
  values: number[],
  k = 1.5,
): { mean: number | null; removed: number } {
  const { filtered, removed } = iqrFilter(values, k);
  return { mean: mean(filtered), removed };
}

export function variance(arr: number[]): number | null {
  if (arr.length < 2) {
    return null;
  }
  const m = mean(arr)!;
  return arr.reduce((s, v) => s + (v - m) * (v - m), 0) / arr.length;
}

export function stddev(arr: number[]): number | null {
  const v = variance(arr);
  return v == null ? null : Math.sqrt(v);
}
