import Typography from '@/components/common/Typography';
import { TIMER_MIN_MINUTES } from '@/constants/time/time';
import { baseTokens, Theme } from '@/styles';
import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

const CELL_CONTAINER_HEIGHT = scale(190);
const CELL_WIDTH = scale(5);
const CELL_GAP = scale(4);
const CELL_HEIGHT = scale(160);
const ELEM_WIDTH = CELL_WIDTH * 5 + CELL_GAP * 4;

const TRIANGLE_WIDTH = scale(25);

const TIMER_RANGE = Array.from(
  { length: 18 },
  (_, index) => (index + 1) * 5,
).filter((el) => el >= TIMER_MIN_MINUTES);

const CENTER_CELL_INDEX = 2;

function TimerTunerSlider({
  theme,
  isRunning,
  setTime,
}: {
  theme: Theme;
  isRunning: boolean;
  setTime: (time: number) => void;
}) {
  const [scrollHalfWidth, setScrollHalfWidth] = useState(0);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (ELEM_WIDTH + CELL_GAP));
    setTime(TIMER_RANGE[idx] * 60 * 1000);
  };

  return (
    <>
      <View style={[styles.container, { opacity: isRunning ? 0.5 : 1 }]}>
        <View
          style={[
            styles.triangleBackground,
            {
              left: scrollHalfWidth - TRIANGLE_WIDTH / 2,
              backgroundColor: theme.colors.pages.timer.slider.background,
            },
          ]}
        />
        <View
          style={[
            styles.triangle,
            {
              left: scrollHalfWidth - TRIANGLE_WIDTH / 2,
              borderBottomColor: theme.colors.pages.timer.slider.picker,
            },
          ]}
        />
        <View
          style={[
            styles.highlightBar,
            {
              left: scrollHalfWidth - CELL_WIDTH / 2 - scale(0.5),
              backgroundColor: theme.colors.pages.timer.slider.picker,
            },
          ]}
        />
        {/* <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0 }}
          colors={[
            theme.colors.pages.timer.slider.background,
            theme.colors.pages.timer.slider.edgeGradient,
          ]}
          style={styles.leftGradient}
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0 }}
          colors={[
            theme.colors.pages.timer.slider.edgeGradient,
            theme.colors.pages.timer.slider.background,
          ]}
          style={styles.rightGradient}
        /> */}
        <FlatList
          data={TIMER_RANGE}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => {
            setScrollHalfWidth(e.nativeEvent.layout.width / 2);
          }}
          scrollEnabled={!isRunning}
          bounces={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToAlignment="center"
          snapToOffsets={TIMER_RANGE.map(
            (_, index) => index * (ELEM_WIDTH + CELL_GAP),
          )}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: ELEM_WIDTH + CELL_GAP,
            offset: (ELEM_WIDTH + CELL_GAP) * index,
            index,
          })}
          keyExtractor={(item) => item.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{
            paddingHorizontal: scrollHalfWidth - ELEM_WIDTH / 2,
            alignItems: 'center',
          }}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Typography
                variant="label"
                style={{
                  color: theme.colors.pages.timer.slider.text.primary,
                }}
              >
                {item}
              </Typography>
              <View style={styles.cellsContainer}>
                {Array.from({ length: 5 }, (_, index) => (
                  <View
                    key={`${item}-${index}`}
                    style={[
                      styles.cell,
                      {
                        backgroundColor:
                          index === CENTER_CELL_INDEX
                            ? theme.colors.pages.timer.slider.cell.primary
                            : theme.colors.pages.timer.slider.cell.secondary,
                        opacity:
                          index === CENTER_CELL_INDEX
                            ? 1
                            : item === TIMER_RANGE[0] &&
                                index < CENTER_CELL_INDEX
                              ? 0
                              : item === TIMER_RANGE[TIMER_RANGE.length - 1] &&
                                  index > CENTER_CELL_INDEX
                                ? 0
                                : 0.6,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
}

export default TimerTunerSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CELL_CONTAINER_HEIGHT,
    marginTop: baseTokens.spacing[3],
    marginBottom: baseTokens.spacing[0],
    alignItems: 'center',
  },
  triangleBackground: {
    position: 'absolute',
    top: scale(2),
    width: TRIANGLE_WIDTH,
    height: TRIANGLE_WIDTH / 2,
    borderRadius: scale(2),
    zIndex: 9,
    pointerEvents: 'none',
  },
  triangle: {
    position: 'absolute',
    top: scale(2),
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_WIDTH / 2,
    borderRightWidth: TRIANGLE_WIDTH / 2,
    borderBottomWidth: TRIANGLE_WIDTH - scale(9),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderRadius: scale(2),
    zIndex: 10,
    pointerEvents: 'none',
    transform: [{ rotate: '180deg' }],
  },
  highlightBar: {
    position: 'absolute',
    bottom: 0,
    pointerEvents: 'none',
    width: CELL_WIDTH + scale(1),
    height: CELL_HEIGHT,
    zIndex: 10,
    borderRadius: baseTokens.borderRadius.xs,
  },
  leftGradient: {
    width: scale(20),
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  rightGradient: {
    width: scale(20),
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  itemContainer: {
    width: ELEM_WIDTH,
    height: CELL_CONTAINER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cellsContainer: {
    width: ELEM_WIDTH,
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: baseTokens.borderRadius.sm,
  },
  separator: {
    width: CELL_GAP,
  },
});
