import OnboardingContent, {
  ONBOARDING_CONTENT,
} from '@/components/SettingPage/HowToUse/OnboardingContent';
import ParticleCanvas from '@/components/SettingPage/HowToUse/ParticleCanvas';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

function HowToUseScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [touchable, setTouchable] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [low, setLow] = useState(false);

  const enableTouchable = async () => {
    if (!touchable) {
      setTimeout(() => {
        setTouchable(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex === ONBOARDING_CONTENT.length - 1) {
      router.push('/');
      return;
    }

    if (currentIndex === 1) {
      setTouchable(false);
    }

    const nextIndex = Math.min(currentIndex + 1, ONBOARDING_CONTENT.length - 1);
    setCurrentIndex(nextIndex);

    if (nextIndex >= 2 && nextIndex < ONBOARDING_CONTENT.length - 2) {
      setLow(true);
      return;
    }

    setLow(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ParticleCanvas low={low} onTouchableEnable={enableTouchable} />
      <OnboardingContent touchable={touchable} onNext={handleNext} />
    </View>
  );
}

export default HowToUseScreen;
