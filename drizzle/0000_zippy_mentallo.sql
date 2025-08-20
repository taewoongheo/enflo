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
CREATE INDEX `idx_sessions_session_id` ON `sessions` (`session_id`);--> statement-breakpoint
CREATE TABLE `timer_sessions` (
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
CREATE INDEX `idx_timer_sessions_session_id` ON `timer_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_start_ts` ON `timer_sessions` (`start_ts`);