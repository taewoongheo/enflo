import Session from '@/models/Session';
import { useSessionCache } from '@/store/sessionCache';
import { baseTokens, Theme } from '@/styles';
import { formatMsToTime } from '@/utils/time';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import Typography from '../common/Typography';

type SessionFocusTime = {
  sessionId: string;
  sessionName: string;
  focusTime: number;
  ratio: number;
};

const SECTION_RADIUS = baseTokens.borderRadius.sm;

const LINE_HEIGHT = scale(30);

const OTHERS_RATIO = 0.1;

export default function FocusTimeBySessionSection({ theme }: { theme: Theme }) {
  const { t } = useTranslation('stats');
  const [canvasWidth, setCanvasWidth] = useState(0);

  const [selectedSessionIdx, setSelectedSessionIdx] = useState<number>(0);

  const [datas, setDatas] = useState<SessionFocusTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sessions = useSessionCache((s) => s.sessionCache);

  useEffect(() => {
    const processSessionData = async () => {
      setIsLoading(true);
      try {
        const totalFocusTime = Object.values(sessions).reduce(
          (acc, session) => acc + session.totalNetFocusMs,
          0,
        );

        if (totalFocusTime === 0) {
          setDatas([]);
          return;
        }

        const raw = Object.values(sessions).map((session: Session) => ({
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          focusTime: session.totalNetFocusMs,
          ratio: session.totalNetFocusMs / totalFocusTime,
        }));

        const othersRow = raw.filter((data) => data.ratio < OTHERS_RATIO);
        const othersRatio = othersRow.reduce(
          (acc, data) => acc + data.ratio,
          0,
        );
        const othersFocusTime = othersRow.reduce(
          (acc, data) => acc + data.focusTime,
          0,
        );

        if (othersRatio > 0) {
          setDatas([
            ...raw.filter((data) => data.ratio >= OTHERS_RATIO),
            {
              sessionId: 'others',
              sessionName: t('others'),
              focusTime: othersFocusTime,
              ratio: othersRatio,
            },
          ]);
          return;
        }

        setDatas([...raw.filter((data) => data.ratio >= OTHERS_RATIO)]);
      } catch {
        // 에러 시에도 빈 데이터로 설정
        setDatas([]);
      } finally {
        setIsLoading(false);
      }
    };

    processSessionData();
  }, [sessions, t]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.pages.main.sessionCard.background,
        borderColor: theme.colors.pages.main.sessionCard.border,
        borderWidth: scale(1),
        borderRadius: baseTokens.borderRadius.sm,
        padding: baseTokens.spacing[3],
      }}
    >
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 100,
          }}
        >
          <ActivityIndicator size="small" color={theme.colors.text.secondary} />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              variant="body1Bold"
              style={{ color: theme.colors.text.primary }}
            >
              {t('focusTimeBySessionTitle')}
            </Typography>
            <Typography
              variant="body1Bold"
              style={{
                color: theme.colors.text.primary,
              }}
            >
              {formatMsToTime(datas[selectedSessionIdx]?.focusTime ?? 0)}
            </Typography>
          </View>

          {datas.length > 0 ? (
            <View
              onLayout={(e) => {
                setCanvasWidth(e.nativeEvent.layout.width);
              }}
              style={{
                width: '100%',
                height: LINE_HEIGHT,
                marginTop: baseTokens.spacing[6],
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              {datas.map((data, index) => (
                <View
                  key={data.sessionId}
                  style={{ gap: baseTokens.spacing[1] }}
                >
                  <View>
                    <Typography
                      variant="label"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color:
                          selectedSessionIdx === index
                            ? theme.colors.pages.timer.slider.text.primary
                            : theme.colors.pages.timer.slider.text.secondary,
                        paddingLeft: baseTokens.spacing[1],
                        width: data.ratio * canvasWidth,
                        opacity: data.sessionId === 'others' ? 0 : 1,
                      }}
                    >
                      {data.sessionName}
                    </Typography>
                  </View>
                  <Pressable
                    onPress={() => setSelectedSessionIdx(index)}
                    style={{
                      width: data.ratio * canvasWidth,
                      height: LINE_HEIGHT,
                      backgroundColor:
                        selectedSessionIdx === index
                          ? theme.colors.pages.timer.slider.text.primary
                          : theme.colors.pages.timer.slider.text.secondary,
                      borderTopLeftRadius: index === 0 ? SECTION_RADIUS : 0,
                      borderBottomLeftRadius: index === 0 ? SECTION_RADIUS : 0,
                      borderTopRightRadius:
                        index === datas.length - 1 ? SECTION_RADIUS : 0,
                      borderBottomRightRadius:
                        index === datas.length - 1 ? SECTION_RADIUS : 0,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingLeft: baseTokens.spacing[1],

                      // borderRightWidth: index === datas.length - 1 ? 1 : 0,
                      // borderWidth: 1,
                      // borderColor: theme.colors.pages.timer.slider.text.primary,
                    }}
                  >
                    <Typography
                      variant="body1Bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: theme.colors.pages.main.sessionCard.background,
                        paddingLeft: baseTokens.spacing[1],
                        opacity: data.sessionId === 'others' ? 0 : 1,
                      }}
                    >
                      {String(data.ratio * 100).substring(0, 2)}%
                    </Typography>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Typography
                variant="label"
                style={{ color: theme.colors.text.primary }}
              >
                {t('focusTimeBySessionNoData')}
              </Typography>
            </View>
          )}
        </>
      )}
    </View>
  );
}
