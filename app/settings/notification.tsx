import ContentLayoutWithBack from '@/components/common/ContentLayoutWithBack';
import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { notificationService } from '@/services/NotificationService';
import { baseTokens, Theme } from '@/styles';
import { hapticSettings } from '@/utils/haptics';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestPermissionsAsync } from '../_layout';

function NotificationScreen() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation('settings');

  const [notificationToggle, setNotificationToggle] = useState(false);

  const [isNotificationMessage, setIsNotificationMessage] = useState(false);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const permission = await Notifications.getPermissionsAsync();

      const notificationSettings = (
        await notificationService.getNotificationSettings()
      )[0];

      if (permission.status !== Notifications.PermissionStatus.GRANTED) {
        notificationService.upsertNotificationSetting(false);
        setNotificationToggle(false);
        return;
      }

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
        setIsNotificationMessage(false);
        return;
      }

      // 앱 알람이 꺼져 있고 시스템 권한도 없는 상태
      setIsNotificationMessage(true);
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
        {isNotificationMessage &&
          (i18n.language === 'ko' ? (
            <KO_MESSAGE theme={theme} />
          ) : (
            <EN_MESSAGE theme={theme} />
          ))}
      </ContentLayoutWithBack>
    </SafeAreaView>
  );
}

const KO_MESSAGE = ({ theme }: { theme: Theme }) => {
  return (
    <View
      style={{
        paddingHorizontal: baseTokens.spacing[4],
        marginTop: baseTokens.spacing[2],
      }}
    >
      <Pressable
        style={{
          marginTop: baseTokens.spacing[2],
        }}
        onPress={() => Linking.openSettings()}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.secondary }}
        >
          알림을 켜려면{' '}
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.pages.timer.slider.picker }}
          >
            설정으로 이동
          </Typography>
          하여 권한을 허용해 주세요.
        </Typography>
      </Pressable>
    </View>
  );
};

const EN_MESSAGE = ({ theme }: { theme: Theme }) => {
  return (
    <View
      style={{
        paddingHorizontal: baseTokens.spacing[4],
        marginTop: baseTokens.spacing[2],
      }}
    >
      <Pressable
        style={{
          marginTop: baseTokens.spacing[2],
        }}
        onPress={() => Linking.openSettings()}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.secondary }}
        >
          To enable notifications, go to{' '}
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.pages.timer.slider.picker }}
          >
            Settings
          </Typography>{' '}
          and allow permissions.
        </Typography>
      </Pressable>
    </View>
  );
};

export default NotificationScreen;
