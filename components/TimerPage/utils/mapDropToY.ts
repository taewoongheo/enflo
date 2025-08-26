import { TimeStatusPoint } from './generateTimeStatus';

export type ChartPoint = { time: number; y: number };

export function mapFocusToY(
  series: TimeStatusPoint[],
  refKPercentile = 0.9,
  tauFactor = 1.5,
): ChartPoint[] {
  const drops = mapDropToY(series, refKPercentile, tauFactor);
  return drops.map((p, index) => {
    const hasData = series[index].hasData;
    const y = hasData ? round2(100 - p.y) : 0;
    return { time: p.time, y };
  });
}

export function mapDropToY(
  series: TimeStatusPoint[],
  refKPercentile: number,
  tauFactor: number,
): ChartPoint[] {
  const vals = series.map((s) => s.dropValue);
  const refK = Math.max(1e-6, percentile(vals, refKPercentile));
  const tau = Math.max(1e-6, refK / tauFactor);

  return series.map((s) => {
    const y = 100 * (1 - Math.exp(-s.dropValue / tau));
    return { time: s.time, y: round2(Math.min(100, y)) };
  });
}

function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0;
  const a = [...arr].sort((x, y) => x - y);
  const pos = (a.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  return a[base + 1] != null
    ? a[base] + rest * (a[base + 1] - a[base])
    : a[base];
}

function round2(x: number) {
  return Math.round(x * 100) / 100;
}
