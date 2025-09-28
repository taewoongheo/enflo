import { INITIAL_THEME_NAME } from '@/contexts/ThemeContext';
import { db } from '@/db/db';
import { appSettings } from '@/db/schema';
import { log } from '@/utils/log';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { getLocales } from 'expo-localization';

class AppSettingsService {
  private db: ReturnType<typeof drizzle>;
  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async initializeAppSettings() {
    const [row] = await this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 1));

    log(`앱 설정: ${JSON.stringify(row)}`);

    if (row) {
      return {
        lang: row.language as 'en' | 'ko',
        theme: row.theme as 'light' | 'dark',
      };
    }

    log(
      `앱 기본 설정 생성: ${JSON.stringify({
        lang: getLocales()?.[0]?.languageCode === 'ko' ? 'ko' : 'en',
        theme: INITIAL_THEME_NAME,
      })}`,
    );

    const initLang = getLocales()?.[0]?.languageCode === 'ko' ? 'ko' : 'en';
    const initTheme = INITIAL_THEME_NAME;

    await this.db
      .insert(appSettings)
      .values({
        id: 1,
        language: initLang,
        theme: initTheme,
        updatedAt: sql`(strftime('%s','now')*1000)`,
      })
      .onConflictDoNothing({ target: appSettings.id });

    return {
      lang: initLang,
      theme: initTheme,
    };
  }

  async getAppTheme(): Promise<'light' | 'dark'> {
    const [row] = await this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 1));

    return (row?.theme as 'light' | 'dark') ?? INITIAL_THEME_NAME;
  }

  async setAppTheme(theme: 'light' | 'dark') {
    await this.db
      .update(appSettings)
      .set({ theme, updatedAt: sql`(strftime('%s','now')*1000)` })
      .where(eq(appSettings.id, 1));
  }

  async getAppLanguage(): Promise<'en' | 'ko'> {
    const [row] = await this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 1));

    return (row?.language as 'en' | 'ko') ?? 'en';
  }

  async setAppLanguage(language: 'en' | 'ko') {
    await this.db
      .update(appSettings)
      .set({ language, updatedAt: sql`(strftime('%s','now')*1000)` })
      .where(eq(appSettings.id, 1));
  }
}

export const appSettingsService = new AppSettingsService(db);
