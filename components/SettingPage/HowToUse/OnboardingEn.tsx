import Typography from '@/components/common/Typography';
import { baseTokens, Theme } from '@/styles';
import { View } from 'react-native';
import { HighlightedText } from './OnboardingContent';

export const ONBOARDING_CONTENT_EN = [
  {
    // **Entropy** represents disorder.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <View style={{ flexDirection: 'row', gap: baseTokens.spacing[1] }}>
          <HighlightedText variant="body1Bold" theme={theme}>
            Entropy
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            represents disorder.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // A low-entropy state is stable. Particles move calmly, in balance—just like now.
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
            A low-entropy state is
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            stable.
          </HighlightedText>
        </View>
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
            Particles move
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            calmly, in balance
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            - just like now.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // But when entropy rises, particles scatter and move chaotically. Tap to feel the change yourself.
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
            But when entropy rises, particles
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            scatter and move chaotically.
          </HighlightedText>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          Tap to feel the change yourself.
        </Typography>
      </View>
    ),
  },
  {
    // For example, ice has particles tightly packed in order—that's low entropy. When it melts into water, they scatter freely and entropy rises.
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
            For example,
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            ice
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            has particles
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            tightly packed in order
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            — that&apos;s low entropy.
          </Typography>
        </View>
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
            When it melts into
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            water
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            , they
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            scatter freely
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            and entropy rises.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // Our **focus** works the same way. Left alone, mental entropy increases and we lose concentration.
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
            Our
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            focus
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            works the same way.
          </Typography>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          Left alone, mental entropy rises and immersion slips away.
        </Typography>
      </View>
    ),
  },
  {
    // This is when immersion gathers our scattered focus and keeps entropy low.
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
            This is when
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            immersion
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            gathers our scattered attention together
          </Typography>
        </View>
        <Typography
          variant="body1Regular"
          style={{ color: theme.colors.text.primary }}
        >
          and keeps entropy low.
        </Typography>
      </View>
    ),
  },
  {
    // enflo visualizes this process so you can stay in immersion.
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
          <HighlightedText variant="body1Bold" theme={theme}>
            visualizes
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            this process
          </Typography>
        </View>
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
            so you can
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            stay immersion.
          </HighlightedText>
        </View>
      </View>
    ),
  },
  {
    // **Low entropy, high immersion** - this is the **enflo** experience.
    content: (theme: Theme) => (
      <View style={{ flexDirection: 'column', gap: baseTokens.spacing[1] }}>
        <HighlightedText variant="body1Bold" theme={theme}>
          Low entropy, high immersion
        </HighlightedText>
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
            - this is the
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            enflo
          </HighlightedText>
          <Typography
            variant="body1Regular"
            style={{ color: theme.colors.text.primary }}
          >
            experience.
          </Typography>
        </View>
      </View>
    ),
  },
  {
    // Now start your immersion with enflo.
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
            Now begin
          </Typography>
          <HighlightedText variant="body1Bold" theme={theme}>
            your immersion
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
      </View>
    ),
  },
];
