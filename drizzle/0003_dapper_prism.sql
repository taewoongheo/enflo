CREATE TABLE `global_entropy_score` (
	`id` integer PRIMARY KEY NOT NULL,
	`entropy_score` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_timer_sessions` (
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
INSERT INTO `__new_timer_sessions`("timer_session_id", "session_id", "start_ts", "end_ts", "target_duration_ms", "entropy_score", "created_at", "updated_at") SELECT "timer_session_id", "session_id", "start_ts", "end_ts", "target_duration_ms", "entropy_score", "created_at", "updated_at" FROM `timer_sessions`;--> statement-breakpoint
DROP TABLE `timer_sessions`;--> statement-breakpoint
ALTER TABLE `__new_timer_sessions` RENAME TO `timer_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_session_id` ON `timer_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_timer_sessions_start_ts` ON `timer_sessions` (`start_ts`);