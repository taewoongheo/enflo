import { clamp } from '@/utils/math';
import { create } from 'zustand';

export const INITIAL_ENTROPY_SCORE = 80;

type EntropyStore = {
  entropyScore: number;
  updateEntropyScore: (es: number) => void;
};

// entropyScore: 0 ~ 100
//  but the UI should be 0 ~ 1(+reverse)
export const useEntropyStore = create<EntropyStore>((set) => ({
  entropyScore: INITIAL_ENTROPY_SCORE,
  updateEntropyScore: (es) =>
    set(() => ({
      entropyScore: clamp(es, 0, 100),
    })),
}));
