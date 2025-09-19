import {
  particleCanvasHeight,
  particleCanvasWidth,
} from '@/components/MainPage/constants/entropySystem/dimension';
import { ENTROPY_SYSTEM_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { generateEdgeParticles } from '@/lib/algorithms/particleDistribution';

const { MAX_THRESHOLD } = ENTROPY_SYSTEM_CONSTANTS.VERY_HIGH;

const RING_PARTICLE_CONSTANTS = [
  {
    threshold: MAX_THRESHOLD,
    stepAngle: MAX_THRESHOLD * 0.06,
    randomOffset: 0,
  },
  {
    threshold: MAX_THRESHOLD * 0.92,
    stepAngle: MAX_THRESHOLD * 0.06,
    randomOffset: 0,
  },
  {
    threshold: MAX_THRESHOLD * 0.85,
    stepAngle: MAX_THRESHOLD * 0.06,
    randomOffset: 0,
  },
  {
    threshold: MAX_THRESHOLD * 0.78,
    stepAngle: MAX_THRESHOLD * 0.06,
    randomOffset: 0,
  },
  {
    threshold: MAX_THRESHOLD * 0.71,
    stepAngle: MAX_THRESHOLD * 0.06,
    randomOffset: 0,
  },
];

export const calculateHowToUseParticles = () => {
  const ringParticles = [];

  for (let i = 0; i < RING_PARTICLE_CONSTANTS.length; i++) {
    const ringParticleConstant = RING_PARTICLE_CONSTANTS[i];

    ringParticles.push(
      ...generateEdgeParticles(
        {
          centerX: particleCanvasWidth / 2,
          centerY: particleCanvasHeight / 2,
          threshold: ringParticleConstant.threshold,
          stepAngle: ringParticleConstant.stepAngle,
          randomOffset: ringParticleConstant.randomOffset,
        },
        i + 1,
      ),
    );
  }

  return [...ringParticles];
};
