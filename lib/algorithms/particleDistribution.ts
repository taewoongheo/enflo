import { ENTROPY_SYSTEM_CONSTANTS } from '@/constants/entropySystem/entropySystem';
import { Vector } from '@/lib/math/Vector';

interface PoissonDiskSamplingOptions {
  width: number;
  height: number;
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
  const { width, height } = options;

  const centerX = width / 2;
  const centerY = height / 2;

  const minDistance = ENTROPY_SYSTEM_CONSTANTS.MIN_DISTANCE;
  const attempts = ENTROPY_SYSTEM_CONSTANTS.MAX_ATTEMPTS;
  const cellSize = minDistance / Math.sqrt(2);
  const grid: (Vector | undefined)[] = [];
  const active: Vector[] = [];

  const centerVector = new Vector(centerX, centerY);

  // initialize grid cell
  const colCnt = Math.floor(width / cellSize);
  const rowCnt = Math.floor(height / cellSize);
  for (let i = 0; i < colCnt * rowCnt; i++) {
    grid[i] = undefined;
  }

  // start point
  const x = centerX + ENTROPY_SYSTEM_CONSTANTS.MIN_THRESHOLD;
  const y = centerY + ENTROPY_SYSTEM_CONSTANTS.MIN_THRESHOLD;
  const colIdx = Math.floor(x / cellSize);
  const rowIdx = Math.floor(y / cellSize);
  const pos = new Vector(x, y);
  grid[colIdx + rowIdx * colCnt] = pos;
  active.push(pos);

  while (active.length > 0) {
    // select random point from active list
    const randIdx = Math.floor(Math.random() * active.length);
    const basePos = active[randIdx];
    let found = false;

    // find a valid sample
    for (let n = 0; n < attempts; n++) {
      // generate random vector
      const sample = Vector.random2D();
      const randMagnitude = minDistance + Math.random() * minDistance;
      sample.setMagnitude(randMagnitude);
      sample.addVector(basePos);

      const col = Math.floor(sample.x / cellSize);
      const row = Math.floor(sample.y / cellSize);

      const distFromCenter = Vector.dist(sample, centerVector);

      if (
        col < 0 ||
        col >= colCnt ||
        row < 0 ||
        row >= rowCnt ||
        grid[col + row * colCnt] ||
        distFromCenter > ENTROPY_SYSTEM_CONSTANTS.MAX_THRESHOLD ||
        distFromCenter < ENTROPY_SYSTEM_CONSTANTS.MIN_THRESHOLD
      ) {
        continue;
      }

      const remainDistance =
        ENTROPY_SYSTEM_CONSTANTS.MAX_THRESHOLD - distFromCenter;
      const currentR = Math.max(0.2, remainDistance * 0.2);

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

interface GenerateEdgeParticlesOptions {
  centerX: number;
  centerY: number;
  threshold: number;
  stepAngle: number;
  randomOffset: number;
}

/**
 * add particles to the edge of the circle
 *
 * @param centerX center X coordinate
 * @param centerY center Y coordinate
 * @param threshold threshold
 * @param stepAngle angle step (degrees)
 * @returns array of edge particles
 */
export function generateEdgeParticles(
  options: GenerateEdgeParticlesOptions,
): Vector[] {
  const { centerX, centerY, threshold, stepAngle, randomOffset } = options;

  const centerVector = new Vector(centerX, centerY);
  const edgeParticles: Vector[] = [];

  for (let i = 0; i < 360; i += stepAngle) {
    const radians = (i * Math.PI) / 180;
    const vector = new Vector(Math.cos(radians), Math.sin(radians));
    vector.setMagnitude(threshold);
    vector.addVector(centerVector);

    // add random offset
    const randomOffsetX = Math.random() * randomOffset;
    const randomOffsetY = Math.random() * randomOffset;

    vector.x += randomOffsetX;
    vector.y += randomOffsetY;

    edgeParticles.push(vector);
  }

  return edgeParticles;
}
