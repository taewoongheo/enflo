import { scale } from 'react-native-size-matters';

export const typography = {
  title1Bold: {
    fontFamily: 'Pretendard-Bold',
    fontSize: scale(32),
    fontWeight: '700',
    lineHeight: 44,
  },
  title1Regular: {
    fontFamily: 'Pretendard-Regular',
    fontSize: scale(32),
    fontWeight: '400',
    lineHeight: 44,
  },
  title2Bold: {
    fontFamily: 'Pretendard-Bold',
    fontSize: scale(24),
    fontWeight: '700',
    lineHeight: 36,
  },
  title2Regular: {
    fontFamily: 'Pretendard-Regular',
    fontSize: scale(24),
    fontWeight: '400',
    lineHeight: 36,
  },

  body1Bold: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: scale(16),
    fontWeight: '600',
    lineHeight: 26,
  },
  body1Regular: {
    fontFamily: 'Pretendard-Regular',
    fontSize: scale(16),
    fontWeight: '400',
    lineHeight: 26,
  },
  body2Bold: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: scale(14),
    fontWeight: '600',
    lineHeight: 24,
  },
  body2Regular: {
    fontFamily: 'Pretendard-Regular',
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: 24,
  },

  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: scale(12),
    fontWeight: '500',
    lineHeight: 20,
  },
} as const;
