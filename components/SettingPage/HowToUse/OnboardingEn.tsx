import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { HighlightedText } from './OnboardingContent';

export const ONBOARDING_CONTENT_EN = [
  {
    // **Entropy** means disorder.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
        <HighlightedText variant="body1Bold" theme={theme}>
          Entropy
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          means disorder.
        </Typography>
      </View>
    ),
  },
  {
    // **enflo** measures it on a **scale from 0 to 1**. The closer to 0, the higher the **flow**.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <HighlightedText variant="body1Bold" theme={theme}>
            enflo
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            measures it on a scale from
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            0 to 1.
          </HighlightedText>
        </View>
        <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            The closer to 0, the higher the
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            flow.
          </HighlightedText>
        </View>
      </View>
    ),
  },
  {
    // When entropy rises, **flow breaks down**. Tap to feel the particles change.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: baseTokens.spacing[1],
          }}
        >
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            When entropy rises,
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            flow breaks down.
          </HighlightedText>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          Tap to feel the particles change.
        </Typography>
      </View>
    ),
  },
  {
    // In a natural state, **entropy keeps rising**.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          In a natural state,
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          entropy keeps rising.
        </HighlightedText>
      </View>
    ),
  },
  {
    // That’s why **flow matters**.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          That’s why
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          flow matters.
        </HighlightedText>
      </View>
    ),
  },
  {
    // **Flow** brings back your focus and **lowers entropy**.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <HighlightedText variant="body1Bold" theme={theme}>
          Flow
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          brings back your focus and
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          lowers entropy.
        </HighlightedText>
      </View>
    ),
  },
  {
    // **enflo** visualizes this process to help you **stay in flow**.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <HighlightedText variant="body1Bold" theme={theme}>
          enflo
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          visualizes this process to help you
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          stay in flow.
        </HighlightedText>
      </View>
    ),
  },
  {
    // Now **begin your flow** with **enflo**.
    content: (theme: Theme) => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: baseTokens.spacing[1],
        }}
      >
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          Now
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          begin your flow.
        </HighlightedText>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          with
        </Typography>
        <HighlightedText variant="body1Bold" theme={theme}>
          enflo.
        </HighlightedText>
      </View>
    ),
  },
];
