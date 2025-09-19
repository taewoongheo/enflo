import { windowHeight } from '@/constants/layout/dimension';
import { Theme } from '@/styles/themes';
import { View } from 'react-native';

function ScrollColorBackground({ theme }: { theme: Theme }) {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: windowHeight * 0.2,
          backgroundColor: theme.colors.pages.timer.slider.background,
        }}
      />
    </>
  );
}

export default ScrollColorBackground;
