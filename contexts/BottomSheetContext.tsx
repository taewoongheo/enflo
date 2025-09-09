import BottomSheet from '@gorhom/bottom-sheet';
import React, { createContext, useContext, useMemo, useRef } from 'react';

type BottomSheetContextType = {
  addSessionBottomSheetRef: React.RefObject<BottomSheet | null>;
  editSessionBottomSheetRef: React.RefObject<BottomSheet | null>;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const addSessionBottomSheetRef = useRef<BottomSheet | null>(null);
  const editSessionBottomSheetRef = useRef<BottomSheet | null>(null);

  const refs = useMemo(
    () => ({
      addSessionBottomSheetRef,
      editSessionBottomSheetRef,
    }),
    [],
  );

  return (
    <BottomSheetContext.Provider value={refs}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
