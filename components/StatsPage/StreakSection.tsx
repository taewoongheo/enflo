import { baseTokens, Theme } from '@/styles';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

const CELL_GAP = scale(3);

export default function StreakSection({ theme }: { theme: Theme }) {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    setCellSize((canvasWidth - CELL_GAP * 13) / 14);
  }, [canvasWidth]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[3],
      }}
    >
      <Typography
        variant="body1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        집중 연속일
      </Typography>

      <Canvas
        onLayout={(e) => setCanvasWidth(e.nativeEvent.layout.width)}
        style={{
          width: '100%',
          height: cellSize * 3 + CELL_GAP * 2,
          backgroundColor: 'red',
        }}
      >
        {Array.from({ length: 28 }).map((_, index) => (
          <Rect
            key={index}
            x={index * cellSize + index * CELL_GAP}
            y={
              cellSize * Math.floor(index / 14) +
              CELL_GAP * Math.floor(index / 14)
            }
            width={cellSize}
            height={cellSize}
          />
        ))}
      </Canvas>
    </View>
  );
}
