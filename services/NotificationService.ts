import { db } from '@/db/db';
import { notificationSettings } from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';

class NotificationService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async getNotificationSettings() {
    const settings = await this.db.select().from(notificationSettings);
    return settings;
  }

  async upsertNotificationSetting(enabled: boolean) {
    await db
      .insert(notificationSettings)
      .values({
        id: 1,
        enabled,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: notificationSettings.id,
        set: {
          enabled,
          updatedAt: new Date(),
        },
      });
  }
}

export const notificationService = new NotificationService(db);
