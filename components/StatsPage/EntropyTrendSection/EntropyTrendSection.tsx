import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Typography from '../../common/Typography';
import PeriodNavigator from './components/PeriodNavigator';
import PeriodToggle from './components/PeriodToggle';
import usePeriodNavigation from './hooks/usePeriodNavigation';

export default function EntropyTrendSection({ theme }: { theme: Theme }) {
  const {
    selectedPeriod,
    periodStr,
    isNextAvailable,
    handleTogglePeriod,
    handlePrev,
    handleNext,
  } = usePeriodNavigation();

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
      {/* 헤더: 타이틀 + 주/월 토글 */}
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Typography
          variant="body1Bold"
          style={{ color: theme.colors.text.primary }}
        >
          엔트로피 변화
        </Typography>

        <PeriodToggle
          theme={theme}
          selectedPeriod={selectedPeriod}
          onToggle={handleTogglePeriod}
        />
      </View>

      {/* 기간 내비 + 라벨 */}
      <PeriodNavigator
        theme={theme}
        periodStr={periodStr}
        isNextAvailable={isNextAvailable}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* TODO: 실제 그래프 영역 */}
      {/* <View style={{ height: scale(160), marginTop: baseTokens.spacing[3] }}>...</View> */}
    </View>
  );
}
