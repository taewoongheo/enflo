PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_timer_sessions` (
	`timer_session_id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`start_ts` integer,
	`end_ts` integer,
	`target_duration_ms` integer NOT NULL,
	`entropy_score` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_timer_sessions`("timer_session_id", "session_id", "start_ts", "end_ts", "target_duration_ms", "entropy_score", "created_at", "updated_at") SELECT "timer_session_id", "session_id", "start_ts", "end_ts", "target_duration_ms", "entropy_score", "created_at", "updated_at" FROM `timer_sessions`;--> statement-breakpoint
DROP TABLE `timer_sessions`;--> statement-breakpoint
ALTER TABLE `__new_timer_sessions` RENAME TO `timer_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_session_id` ON `timer_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_start_ts` ON `timer_sessions` (`start_ts`);--> statement-breakpoint
CREATE TABLE `__new_app_state_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`app_state` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_app_state_events`("id", "timer_session_id", "timestamp", "app_state", "created_at") SELECT "id", "timer_session_id", "timestamp", "app_state", "created_at" FROM `app_state_events`;--> statement-breakpoint
DROP TABLE `app_state_events`;--> statement-breakpoint
ALTER TABLE `__new_app_state_events` RENAME TO `app_state_events`;--> statement-breakpoint
CREATE INDEX `idx_app_state_events_timer_session_id` ON `app_state_events` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `__new_pause_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`start_ts` integer NOT NULL,
	`end_ts` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_pause_events`("id", "timer_session_id", "start_ts", "end_ts", "duration_ms", "created_at") SELECT "id", "timer_session_id", "start_ts", "end_ts", "duration_ms", "created_at" FROM `pause_events`;--> statement-breakpoint
DROP TABLE `pause_events`;--> statement-breakpoint
ALTER TABLE `__new_pause_events` RENAME TO `pause_events`;--> statement-breakpoint
CREATE INDEX `idx_pause_events_timer_session_id` ON `pause_events` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `__new_scroll_interaction_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_scroll_interaction_events`("id", "timer_session_id", "timestamp", "created_at") SELECT "id", "timer_session_id", "timestamp", "created_at" FROM `scroll_interaction_events`;--> statement-breakpoint
DROP TABLE `scroll_interaction_events`;--> statement-breakpoint
ALTER TABLE `__new_scroll_interaction_events` RENAME TO `scroll_interaction_events`;--> statement-breakpoint
CREATE INDEX `idx_scroll_events_timer_session_id` ON `scroll_interaction_events` (`timer_session_id`);