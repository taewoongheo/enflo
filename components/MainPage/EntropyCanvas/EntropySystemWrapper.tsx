import { Vector } from '@/lib/math/Vector';
import { Theme } from '@/styles';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

interface EntropySystemWrapperProps {
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
  theme: Theme;
  particles: Vector[];
  ParticleComponent: React.ComponentType<ParticleProps>;
}

export interface ParticleProps {
  centerX: number;
  centerY: number;
  color: string;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
}

function EntropySystemWrapper({
  touchX,
  touchY,
  isTouching,
  theme,
  particles,
  ParticleComponent,
}: EntropySystemWrapperProps) {
  return (
    <>
      {particles.map((particle, index) => {
        // 각 엔트로피 레벨별로 다른 radius 범위를 가질 수 있도록 추후 확장 가능
        const colorValue = theme.colors.particles.base;
        const maxAlpha = theme.colors.particles.maxAlpha;
        const minAlpha = theme.colors.particles.minAlpha;
        const alpha = Math.random() * (maxAlpha - minAlpha) + minAlpha;
        const color = `rgba(${colorValue}, ${colorValue}, ${colorValue}, ${alpha})`;

        return (
          <ParticleComponent
            key={`particle-${index}-${particle.x}-${particle.y}`}
            centerX={particle.x}
            centerY={particle.y}
            color={color}
            touchX={touchX}
            touchY={touchY}
            isTouching={isTouching}
          />
        );
      })}
    </>
  );
}

export default EntropySystemWrapper;
