import { db } from '@/db/db';
import { globalEntropyStatus } from '@/db/schema';
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
        .update(globalEntropyStatus)
        .set({ entropyScore: newScore, updatedAt: now })
        .where(eq(globalEntropyStatus.id, ENTROPY_SCORE_ID));

      useEntropyStore.getState().updateEntropyScore(newScore);
    } catch (error) {
      throw new Error('Failed to update entropy score', { cause: error });
    }
  }

  async initializeEntropy(score: number, now: number) {
    try {
      await this.db
        .insert(globalEntropyStatus)
        .values({
          id: ENTROPY_SCORE_ID,
          entropyScore: score,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: globalEntropyStatus.id,
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
      .from(globalEntropyStatus)
      .where(eq(globalEntropyStatus.id, ENTROPY_SCORE_ID));

    return entropyRow[0];
  }
}

export const entropyService = new EntropyService(db);
