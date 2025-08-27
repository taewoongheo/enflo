import Typography from '@/components/common/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { db } from '@/db/db';
import { globalEntropyScore } from '@/db/schema';
import { INITIAL_ENTROPY_SCORE, useEntropyStore } from '@/store/entropyStore';
import { baseTokens } from '@/styles';
import { clamp } from '@/utils/math';
import { normalizeScoreToEntropy } from '@/utils/score';
import { AntDesign } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

const DELTA_PER_MINUTE = 20;

const EntropyScore = () => {
  const { theme } = useTheme();
  const entropyScore = useEntropyStore((s) => s.entropyScore);
  const updateEntropyScore = useEntropyStore((s) => s.updateEntropyScore);

  const entropyStateSnapshot = useRef<{
    entropyScore: number;
    delta: number;
    updatedAt: number;
  } | null>(null);

  const updateDBRef = useRef<number | null>(null);

  useEffect(() => {
    entropyStateSnapshot.current = {
      entropyScore: entropyScore,
      delta: 0,
      updatedAt: Date.now(),
    };
  }, [entropyScore]);

  useFocusEffect(
    useCallback(() => {
      updateDBRef.current = setInterval(async () => {
        if (!entropyStateSnapshot.current) {
          return;
        }

        const now = Date.now();
        const diffMin = (now - entropyStateSnapshot.current.updatedAt) / 60000;
        const delta = diffMin * DELTA_PER_MINUTE;
        const newScore = clamp(
          entropyStateSnapshot.current.entropyScore - delta,
          0,
          100,
        );

        try {
          await db
            .update(globalEntropyScore)
            .set({
              entropyScore: newScore,
              updatedAt: now,
            })
            .where(eq(globalEntropyScore.id, 1));

          entropyStateSnapshot.current = {
            entropyScore: newScore,
            delta: delta,
            updatedAt: now,
          };

          updateEntropyScore(newScore);
        } catch (error) {
          console.error(error);
        }
      }, 3 * 1000);

      return () => {
        try {
          if (!entropyStateSnapshot.current) {
            return;
          }

          db.update(globalEntropyScore)
            .set({
              entropyScore: entropyStateSnapshot.current.entropyScore,
              updatedAt: entropyStateSnapshot.current.updatedAt,
            })
            .where(eq(globalEntropyScore.id, 1));

          updateEntropyScore(entropyStateSnapshot.current.entropyScore);
        } catch (error) {
          throw new Error('Failed to update db', { cause: error });
        } finally {
          if (updateDBRef.current) {
            clearInterval(updateDBRef.current);
            updateDBRef.current = null;
          }
        }
      };
    }, []),
  );

  useEffect(() => {
    const updateGlobalEntropyScore = async () => {
      const entropyRow = await db
        .select()
        .from(globalEntropyScore)
        .where(eq(globalEntropyScore.id, 1));

      let entropy;

      if (!entropyRow.length) {
        try {
          await db.insert(globalEntropyScore).values({
            id: 1,
            entropyScore: INITIAL_ENTROPY_SCORE,
            updatedAt: Date.now(),
          });
        } catch (error) {
          throw new Error('Failed to insert entropy score', { cause: error });
        }

        entropy = {
          id: 1,
          entropyScore: INITIAL_ENTROPY_SCORE,
          updatedAt: Date.now(),
        };
      } else {
        entropy = entropyRow[0];
      }

      const now = Date.now();
      const diffMin = (now - entropy.updatedAt) / 60000;
      const delta = diffMin * DELTA_PER_MINUTE;
      const newScore = clamp(entropy.entropyScore - delta, 0, 100);

      try {
        await db
          .update(globalEntropyScore)
          .set({
            entropyScore: newScore,
            updatedAt: now,
          })
          .where(eq(globalEntropyScore.id, 1));

        entropyStateSnapshot.current = {
          entropyScore: newScore,
          delta: delta,
          updatedAt: now,
        };

        updateEntropyScore(newScore);
      } catch (error) {
        console.error(error);
      }
    };

    updateGlobalEntropyScore();
  }, []);

  return (
    <Pressable
      style={[styles.entropyScoreContainer]}
      onPress={() => {
        console.log('entropy score pressed');
      }}
    >
      <Typography
        variant="title1Bold"
        style={{ color: theme.colors.text.primary }}
      >
        {normalizeScoreToEntropy(entropyScore)}
      </Typography>
      <AntDesign
        name="questioncircle"
        size={baseTokens.iconSize.xs}
        color={theme.colors.text.secondary}
        style={styles.iconSpacing}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  entropyScoreContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  iconSpacing: {
    marginTop: baseTokens.spacing[2],
    marginLeft: baseTokens.spacing[1],
  },
});

export default EntropyScore;
