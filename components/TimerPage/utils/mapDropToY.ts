type TimeStatusPoint = { time: number; dropValue: number };
type ChartPoint = { time: number; y: number };

/**
 * dropValue → y(0~100) 매핑 (exp 고정)
 * - refKPercentile: 분포 기준치 분위수(기본 P95)
 * - tauFactor: 포화 속도 조절 (작을수록 더 빨리 치솟아 스파이크가 크게 보임)
 */
export function mapDropToY(
  series: TimeStatusPoint[],
  refKPercentile = 0.9,
  tauFactor = 1.8,
): ChartPoint[] {
  const vals = series.map((s) => s.dropValue);
  const refK = Math.max(1e-6, percentile(vals, refKPercentile));
  const tau = Math.max(1e-6, refK / tauFactor);

  return series.map((s) => {
    const y = 100 * (1 - Math.exp(-s.dropValue / tau));
    return { time: s.time, y: round2(Math.min(100, y)) };
  });
}

export function mapFocusToY(
  series: TimeStatusPoint[],
  refKPercentile = 0.9,
  tauFactor = 1.8,
): ChartPoint[] {
  const drops = mapDropToY(series, refKPercentile, tauFactor);
  return drops.map((p) => ({ time: p.time, y: round2(100 - p.y) }));
}

/* ───────── utils ───────── */
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
