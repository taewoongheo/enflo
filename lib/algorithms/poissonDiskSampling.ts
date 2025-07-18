import { Vector } from '@/lib/math/Vector';

interface PoissonDiskSamplingOptions {
  width: number;
  height: number;
  minDistance?: number;
  maxAttempts?: number;
  centerX?: number;
  centerY?: number;
  maxThreshold?: number;
  minThreshold?: number;
}

/**
 * random point generation using poisson disk sampling
 *
 * @param options sampling options
 * @returns array of generated points
 */
export function poissonDiskSampling(
  options: PoissonDiskSamplingOptions,
): (Vector | undefined)[] {
  const {
    width,
    height,
    minDistance = 19,
    maxAttempts = 30,
    centerX = width / 2,
    centerY = height / 2,
    maxThreshold = 100,
    minThreshold = 20,
  } = options;

  const r = minDistance;
  const k = maxAttempts;
  const w = r / Math.sqrt(2); // grid cell size
  const grid: (Vector | undefined)[] = [];
  const active: Vector[] = [];

  const centerVector = new Vector(centerX, centerY);

  // initialize grid cell
  const colCnt = Math.floor(width / w);
  const rowCnt = Math.floor(height / w);
  for (let i = 0; i < colCnt * rowCnt; i++) {
    grid[i] = undefined;
  }

  // start with random point
  const x = centerX + minThreshold;
  const y = centerY + minThreshold;
  const colIdx = Math.floor(x / w);
  const rowIdx = Math.floor(y / w);
  const pos = new Vector(x, y);
  grid[colIdx + rowIdx * colCnt] = pos;
  active.push(pos);

  while (active.length > 0) {
    // select random point from active list
    const randIdx = Math.floor(Math.random() * active.length);
    const basePos = active[randIdx];
    let found = false;

    // attempt k times to find a valid sample
    for (let n = 0; n < k; n++) {
      // generate random vector
      const sample = Vector.random2D();
      const randMagnitude = r + Math.random() * r; // r~2r range
      sample.setMagnitude(randMagnitude);
      sample.addVector(basePos);

      const col = Math.floor(sample.x / w);
      const row = Math.floor(sample.y / w);

      const distFromCenter = Vector.dist(sample, centerVector);

      if (
        col < 0 ||
        col >= colCnt ||
        row < 0 ||
        row >= rowCnt ||
        grid[col + row * colCnt] ||
        distFromCenter > maxThreshold ||
        distFromCenter < minThreshold
      ) {
        continue;
      }

      const remainDistance = maxThreshold - distFromCenter;
      const currentR = Math.max(1, remainDistance * 0.2);

      let neighborDistOk = true;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const neighborColIdx = col + i;
          const neighborRowIdx = row + j;

          if (
            neighborColIdx < 0 ||
            neighborColIdx >= colCnt ||
            neighborRowIdx < 0 ||
            neighborRowIdx >= rowCnt
          ) {
            continue;
          }

          const neighborGridIdx = neighborColIdx + neighborRowIdx * colCnt;
          const neighborPos = grid[neighborGridIdx];
          if (neighborPos === undefined) {
            continue;
          }

          const distFromNeighbor = Vector.dist(sample, neighborPos);
          if (distFromNeighbor < currentR) {
            neighborDistOk = false;
            break;
          }
        }
        if (!neighborDistOk) {
          break;
        }
      }

      if (neighborDistOk) {
        found = true;
        grid[col + row * colCnt] = sample;
        active.push(sample);
        break;
      }
    }

    // tried k times, but failed to find a valid sample
    if (!found) {
      active.splice(randIdx, 1);
    }
  }

  return grid;
}

/**
 * add particles to the edge of the circle
 *
 * @param centerX center X coordinate
 * @param centerY center Y coordinate
 * @param radius radius
 * @param stepAngle angle step (degrees)
 * @returns array of edge particles
 */
export function generateEdgeParticles(
  centerX: number,
  centerY: number,
  radius: number,
  stepAngle: number = 3,
): Vector[] {
  const centerVector = new Vector(centerX, centerY);
  const edgeParticles: Vector[] = [];

  for (let i = 0; i < 360; i += stepAngle) {
    const radians = (i * Math.PI) / 180;
    const vector = new Vector(Math.cos(radians), Math.sin(radians));
    vector.setMagnitude(radius);
    vector.addVector(centerVector);

    // add random offset
    const randomOffsetX = Math.random() * 6;
    const randomOffsetY = Math.random() * 6;
    vector.x += randomOffsetX;
    vector.y += randomOffsetY;

    edgeParticles.push(vector);
  }

  return edgeParticles;
}
