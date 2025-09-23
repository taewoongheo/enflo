import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { notificationService } from '@/services/NotificationService';
import { baseTokens } from '@/styles';
import { hapticSettings } from '@/utils/haptics';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestPermissionsAsync } from '../_layout';

function NotificationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');

  const [notificationToggle, setNotificationToggle] = useState(false);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const notificationSettings = (
        await notificationService.getNotificationSettings()
      )[0];

      setNotificationToggle(notificationSettings.enabled);
    };

    checkNotificationPermission();
  }, []);

  const handleNotificationToggle = async () => {
    hapticSettings();

    try {
      if (notificationToggle) {
        // cancel notification
        await notificationService.upsertNotificationSetting(false);
        setNotificationToggle(false);
        return;
      }

      // schedule notification
      const res = await requestPermissionsAsync();
      if (res.status === Notifications.PermissionStatus.GRANTED) {
        await notificationService.upsertNotificationSetting(true);
        setNotificationToggle(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ContentLayoutWithBack color={theme.colors.text.primary}>
        <Pressable
          onPress={handleNotificationToggle}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: baseTokens.spacing[4],
            paddingVertical: baseTokens.spacing[2],
          }}
        >
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            {t('timerAlarm')}
          </Typography>
          <Switch
            value={notificationToggle}
            onValueChange={handleNotificationToggle}
            ios_backgroundColor={theme.colors.pages.timer.slider.cell.secondary}
            trackColor={{
              true: theme.colors.pages.main.sessionCard.border,
              false: theme.colors.pages.timer.slider.cell.secondary,
            }}
            thumbColor={
              notificationToggle
                ? theme.colors.pages.timer.slider.picker
                : theme.colors.pages.main.sessionCard.background
            }
          />
        </Pressable>
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

export default NotificationScreen;
