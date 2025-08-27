import { db } from '@/db/db';
import { globalEntropyScore } from '@/db/schema';
import { useEntropyStore } from '@/store/entropyStore';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const ENTROPY_SCORE_ID = 1;

class EntropyService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async updateEntropy(newScore: number, now: number): Promise<void> {
    try {
      await this.db
        .update(globalEntropyScore)
        .set({ entropyScore: newScore, updatedAt: now })
        .where(eq(globalEntropyScore.id, ENTROPY_SCORE_ID));

      useEntropyStore.getState().updateEntropyScore(newScore);
    } catch (error) {
      throw new Error('Failed to update entropy score', { cause: error });
    }
  }

  async initializeEntropy(score: number, now: number) {
    try {
      await this.db
        .insert(globalEntropyScore)
        .values({
          id: ENTROPY_SCORE_ID,
          entropyScore: score,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: globalEntropyScore.id,
          set: {
            entropyScore: score,
            updatedAt: now,
          },
        });
    } catch (error) {
      throw new Error('Failed to insert entropy score', { cause: error });
    }
  }

  async getEntropy(): Promise<
    | {
        entropyScore: number;
        updatedAt: number;
      }
    | undefined
  > {
    const entropyRow = await this.db
      .select()
      .from(globalEntropyScore)
      .where(eq(globalEntropyScore.id, ENTROPY_SCORE_ID));

    return entropyRow[0];
  }
}

export const entropyService = new EntropyService(db);
