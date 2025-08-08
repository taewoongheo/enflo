import { clamp } from '@/utils/math';
import { create } from 'zustand';

type EntropyStore = {
  entropyScore: number;
  updateEntropyScore: (es: number) => void;
};

// entropyScore: 0 ~ 100
//  but the UI should be 0 ~ 1(+reverse)
export const useEntropyStore = create<EntropyStore>((set) => ({
  entropyScore: 0,
  updateEntropyScore: (es) =>
    set((state: { entropyScore: number }) => ({
      entropyScore: clamp(state.entropyScore + es, 0, 100),
    })),
}));
