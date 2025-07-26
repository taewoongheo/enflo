import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import { useTheme } from '@/contexts/ThemeContext';
import { sessionMockData } from '@/data/sessionMockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Timer() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();

  useEffect(() => {
    const session = sessionMockData.find((el) => el.sessionId === sessionId);

    if (!session) {
      router.back();
      return;
    }
  }, [router, sessionId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack>
        <Text style={{ color: theme.colors.text.primary }}>timer</Text>
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default Timer;
