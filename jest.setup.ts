import { jest } from '@jest/globals';
import React from 'react';
import 'react-native-gesture-handler/jestSetup';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  useRootNavigationState: () => ({ key: 'test' }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  Stack: ({ children }: { children: React.ReactNode }) => children,
  'Stack.Screen': ({ children }: { children: React.ReactNode }) => children,
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const ScrollView = require('react-native/Libraries/Components/ScrollView/ScrollView');

  return {
    ScrollView,
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: jest.fn((component) => component),
    Swipeable: View,
    DrawerLayout: View,
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    TouchableOpacity: View,
    TouchableWithoutFeedback: View,
  };
});

// Mock react-native-size-matters
jest.mock('react-native-size-matters', () => ({
  scale: jest.fn((size) => size),
  verticalScale: jest.fn((size) => size),
  moderateScale: jest.fn((size) => size),
}));

// Mock react-native-uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'ko',
    },
  }),
}));

// Mock @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Circle: 'Circle',
  Group: 'Group',
  Path: 'Path',
  Rect: 'Rect',
  RoundedRect: 'RoundedRect',
  Text: 'Text',
  useValue: jest.fn(() => ({ current: 0 })),
  useComputedValue: jest.fn(() => ({ current: 0 })),
  useValueEffect: jest.fn(),
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useDerivedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedReaction: jest.fn(),
  useAnimatedProps: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
  interpolate: jest.fn(),
  Extrapolate: {
    CLAMP: 'clamp',
    EXTEND: 'extend',
    IDENTITY: 'identity',
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    poly: jest.fn(),
    sin: jest.fn(),
    circle: jest.fn(),
    exp: jest.fn(),
    elastic: jest.fn(),
    back: jest.fn(),
    bounce: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn(),
  },
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
