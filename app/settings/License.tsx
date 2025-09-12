import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function LicenseScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        <Text>License</Text>
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default LicenseScreen;
