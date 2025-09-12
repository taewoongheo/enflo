import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function FeedbackScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        <Text>Feedback</Text>
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default FeedbackScreen;
