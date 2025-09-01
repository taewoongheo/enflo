CREATE TABLE `app_state_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`app_state` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_app_state_events_timer_session_id` ON `app_state_events` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `entropy_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entropy_score` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`duration_ms` integer NOT NULL,
	`timer_session_id` text NOT NULL,
	`day_key` integer GENERATED ALWAYS AS (CAST(strftime('%Y%m%d', (created_at / 1000), 'unixepoch', 'localtime') AS INTEGER)) VIRTUAL,
	`week_key` integer GENERATED ALWAYS AS (CAST(strftime('%Y%W',  (created_at / 1000), 'unixepoch', 'localtime') AS INTEGER)) VIRTUAL,
	`month_key` integer GENERATED ALWAYS AS (CAST(strftime('%Y%m',  (created_at / 1000), 'unixepoch', 'localtime') AS INTEGER)) VIRTUAL,
	`year_key` integer GENERATED ALWAYS AS (CAST(strftime('%Y',    (created_at / 1000), 'unixepoch', 'localtime') AS INTEGER)) VIRTUAL
);
--> statement-breakpoint
CREATE INDEX `entropy_log_created_at_idx` ON `entropy_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `entropy_log_day_key_idx` ON `entropy_log` (`day_key`);--> statement-breakpoint
CREATE INDEX `entropy_log_week_key_idx` ON `entropy_log` (`week_key`);--> statement-breakpoint
CREATE INDEX `entropy_log_month_key_idx` ON `entropy_log` (`month_key`);--> statement-breakpoint
CREATE INDEX `entropy_log_year_key_idx` ON `entropy_log` (`year_key`);--> statement-breakpoint
CREATE INDEX `entropy_log_timer_session_idx` ON `entropy_log` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `global_entropy_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`entropy_score` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pause_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`start_ts` integer NOT NULL,
	`end_ts` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_pause_events_timer_session_id` ON `pause_events` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `scroll_interaction_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timer_session_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`timer_session_id`) REFERENCES `timer_sessions`(`timer_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_scroll_events_timer_session_id` ON `scroll_interaction_events` (`timer_session_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`session_name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `timer_sessions` (
	`timer_session_id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`start_ts` integer NOT NULL,
	`end_ts` integer,
	`target_duration_ms` integer NOT NULL,
	`entropy_score` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_session_id` ON `timer_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_start_ts` ON `timer_sessions` (`start_ts`);