import * as Haptics from 'expo-haptics';

// 탭 네비게이션 진동
export const hapticTabSwitch = () => Haptics.selectionAsync();

// 엔트로피 드래그, 터치 진동
export const hapticEntropyDrag = () => Haptics.selectionAsync();

// 타이머 시작/정지 진동
export const hapticTimerToggle = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// 설정 진동
export const hapticSettings = () => Haptics.selectionAsync();

// 세션 추가 버튼 진동
export const hapticAddSession = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// submit 버튼 진동
export const hapticSubmit = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// 몰입 기록 추가 로드 진동
export const hapticAddRecordLoad = () => Haptics.selectionAsync();

// 타이머 횡 스크롤 진동
export const hapticTimerHorizontalSnap = () => Haptics.selectionAsync();

// 온보딩 다음 버튼 진동
export const hapticOnboardingNext = () => Haptics.selectionAsync();
