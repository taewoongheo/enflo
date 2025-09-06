import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
  sessionId: text('session_id').primaryKey().notNull(),
  sessionName: text('session_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(strftime('%s', 'now') * 1000)`),
});

export const timerSessions = sqliteTable(
  'timer_sessions',
  {
    timerSessionId: text('timer_session_id').primaryKey().notNull(),
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.sessionId, { onDelete: 'cascade' })
      .notNull(),
    startTs: integer('start_ts').notNull(),
    endTs: integer('end_ts'),
    targetDurationMs: integer('target_duration_ms').notNull(),
    entropyScore: integer('entropy_score'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => [
    index('idx_timer_sessions_session_id').on(table.sessionId),
    index('idx_timer_sessions_start_ts').on(table.startTs),
    index('idx_timer_sessions_end_ts').on(table.endTs),
  ],
);

export const pauseEvents = sqliteTable(
  'pause_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timerSessionId: text('timer_session_id')
      .notNull()
      .references(() => timerSessions.timerSessionId, { onDelete: 'cascade' }),
    startTs: integer('start_ts').notNull(),
    endTs: integer('end_ts').notNull(),
    durationMs: integer('duration_ms').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => [
    index('idx_pause_events_timer_session_id').on(table.timerSessionId),
  ],
);

export const appStateEvents = sqliteTable(
  'app_state_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timerSessionId: text('timer_session_id')
      .notNull()
      .references(() => timerSessions.timerSessionId, { onDelete: 'cascade' }),
    timestamp: integer('timestamp').notNull(),
    appState: text('app_state', { enum: ['active', 'background'] }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => [
    index('idx_app_state_events_timer_session_id').on(table.timerSessionId),
  ],
);

export const scrollInteractionEvents = sqliteTable(
  'scroll_interaction_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timerSessionId: text('timer_session_id')
      .notNull()
      .references(() => timerSessions.timerSessionId, { onDelete: 'cascade' }),
    timestamp: integer('timestamp').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),
  },
  (table) => [
    index('idx_scroll_events_timer_session_id').on(table.timerSessionId),
  ],
);

export const globalEntropyStatus = sqliteTable('global_entropy_status', {
  id: integer('id').primaryKey(),
  entropyScore: integer('entropy_score').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const entropyLog = sqliteTable(
  'entropy_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    entropyScore: integer('entropy_score').notNull(),

    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(strftime('%s', 'now') * 1000)`),

    timerSessionId: text('timer_session_id'),

    dayKey: integer('day_key').notNull(), // YYYYMMDD

    weekKey: integer('week_key').notNull(), // YYYYWW

    monthKey: integer('month_key').notNull(), // YYYYMM

    yearKey: integer('year_key').notNull(), // YYYY
  },
  (table) => [
    index('entropy_log_created_at_idx').on(table.createdAt),
    index('entropy_log_day_key_idx').on(table.dayKey),
    index('entropy_log_week_key_idx').on(table.weekKey),
    index('entropy_log_month_key_idx').on(table.monthKey),
    index('entropy_log_year_key_idx').on(table.yearKey),
    index('entropy_log_timer_session_idx').on(table.timerSessionId),
  ],
);

export const sessionsRelations = relations(sessions, ({ many }) => ({
  timerSessions: many(timerSessions),
}));

export const timerSessionsRelations = relations(
  timerSessions,
  ({ one, many }) => ({
    session: one(sessions, {
      fields: [timerSessions.sessionId],
      references: [sessions.sessionId],
    }),
    pauseEvents: many(pauseEvents),
    appStateEvents: many(appStateEvents),
    scrollInteractionEvents: many(scrollInteractionEvents),
  }),
);

export const pauseEventsRelations = relations(pauseEvents, ({ one }) => ({
  timerSession: one(timerSessions, {
    fields: [pauseEvents.timerSessionId],
    references: [timerSessions.timerSessionId],
  }),
}));

export const appStateEventsRelations = relations(appStateEvents, ({ one }) => ({
  timerSession: one(timerSessions, {
    fields: [appStateEvents.timerSessionId],
    references: [timerSessions.timerSessionId],
  }),
}));

export const scrollInteractionEventsRelations = relations(
  scrollInteractionEvents,
  ({ one }) => ({
    timerSession: one(timerSessions, {
      fields: [scrollInteractionEvents.timerSessionId],
      references: [timerSessions.timerSessionId],
    }),
  }),
);
