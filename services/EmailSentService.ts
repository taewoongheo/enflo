import { db } from '@/db/db';
import { emailLastSent } from '@/db/schema';
import { signRequest } from '@/utils/auth';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import Constants from 'expo-constants';

const EMAIL_API_URL = Constants.expoConfig?.extra?.EMAIL_API_URL;

class EmailSentService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async checkEmailSentLimit(type: 'feedback' | 'promotion'): Promise<boolean> {
    const row = await this.db
      .select()
      .from(emailLastSent)
      .where(eq(emailLastSent.emailType, type));

    const lastSent = row[0]?.sentAt?.getTime();

    const now = new Date().getTime();
    if (lastSent && now - lastSent < 1000 * 60 * 60 * 24) {
      return true;
    }

    return false;
  }

  async sendEmail(
    type: 'feedback' | 'promotion',
    timestamp: string,
    rawBody: string,
  ) {
    try {
      await fetch(`${EMAIL_API_URL}/feedback`, {
        method: 'POST',
        body: rawBody,
        headers: {
          'Content-Type': 'application/json',
          'x-timestamp': timestamp,
          'x-signature': signRequest('POST', '/feedback', timestamp, rawBody),
        },
      });

      await this.db
        .insert(emailLastSent)
        .values({
          emailType: type,
          sentAt: sql`(strftime('%s','now')*1000)`,
        })
        .onConflictDoUpdate({
          target: emailLastSent.emailType,
          set: {
            sentAt: sql`(strftime('%s','now')*1000)`,
          },
        });
    } catch (error) {
      throw new Error('Failed to send email', { cause: error });
    }
  }
}

export default new EmailSentService(db);
