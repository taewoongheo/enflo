import { baseTokens, Theme } from '@/styles';
import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

const CELL_WIDTH = scale(5);
const CELL_GAP = scale(4);
const CELL_HEIGHT = scale(160);
const ELEM_WIDTH = CELL_WIDTH * 5 + CELL_GAP * 4;

const timer = Array.from({ length: 18 }, (_, index) => (index + 1) * 5);

function TimerTunerSlider({
  theme,
  setTime,
}: {
  theme: Theme;
  setTime: (time: number) => void;
}) {
  const [scrollHalfWidth, setScrollHalfWidth] = useState(0);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (ELEM_WIDTH + CELL_GAP));
    setTime(timer[idx]);
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          height: scale(170),
          marginTop: baseTokens.spacing[3],
          marginBottom: baseTokens.spacing[0],
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: scrollHalfWidth - CELL_WIDTH / 2 - scale(0.5),
            pointerEvents: 'none',
            width: CELL_WIDTH + scale(1),
            height: scale(157),
            backgroundColor: 'yellow',
            zIndex: 10,
            borderRadius: baseTokens.borderRadius.xs,
          }}
        />
        <FlatList
          data={timer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => {
            setScrollHalfWidth(e.nativeEvent.layout.width / 2);
          }}
          bounces={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToAlignment="center"
          snapToOffsets={timer.map(
            (_, index) => index * (ELEM_WIDTH + CELL_GAP),
          )}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: ELEM_WIDTH + CELL_GAP,
            offset: (ELEM_WIDTH + CELL_GAP) * index,
            index,
          })}
          keyExtractor={(item) => item.toString()}
          ItemSeparatorComponent={() => <View style={{ width: CELL_GAP }} />}
          contentContainerStyle={{
            paddingHorizontal: scrollHalfWidth - ELEM_WIDTH / 2,
            alignItems: 'center',
          }}
          renderItem={({ item }) => (
            <View
              style={{
                width: ELEM_WIDTH,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: theme.colors.text.primary }}>{item}</Text>
              <View
                style={{
                  width: ELEM_WIDTH,
                  height: CELL_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: CELL_GAP,
                }}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <View
                    key={new Date().getTime() + index}
                    style={[
                      {
                        width: CELL_WIDTH,
                        height: CELL_HEIGHT,
                        borderRadius: baseTokens.borderRadius.sm,
                        backgroundColor:
                          index === 2
                            ? theme.colors.primary
                            : theme.colors.secondary,
                        opacity:
                          index === 2
                            ? 1
                            : item === 5 && index < 2
                              ? 0
                              : item === 90 && index > 2
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
