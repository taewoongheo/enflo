import { ENTROPY_SYSTEM_GLOBAL_CONSTANTS } from '@/components/MainPage/constants/entropySystem/entropySystem';
import { clamp } from '@/utils/math';
import { create } from 'zustand';

type EntropyStore = {
  entropyScore: number;
  updateEntropyScore: (es: number) => void;
};

// entropyScore: 0 ~ 100
//  but the UI should be 0 ~ 1(+reverse)
export const useEntropyStore = create<EntropyStore>((set) => ({
  entropyScore: ENTROPY_SYSTEM_GLOBAL_CONSTANTS.INITIAL_ENTROPY_SCORE,
  updateEntropyScore: (es) =>
    set(() => ({
      entropyScore: clamp(
        es,
        ENTROPY_SYSTEM_GLOBAL_CONSTANTS.MIN_ENTROPY_SCORE,
        ENTROPY_SYSTEM_GLOBAL_CONSTANTS.MAX_ENTROPY_SCORE,
      ),
    })),
}));
