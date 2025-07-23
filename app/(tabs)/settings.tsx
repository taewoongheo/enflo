import { ContentLayout } from '@/components/common/ContentLayout';
import { StyleSheet, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ContentLayout>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>This is the settings page</Text>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
