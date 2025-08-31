PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_global_entropy_score` (
	`id` integer PRIMARY KEY NOT NULL,
	`entropy_score` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`streak_started_at` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_global_entropy_score`("id", "entropy_score", "updated_at", "streak_started_at") SELECT "id", "entropy_score", "updated_at", "streak_started_at" FROM `global_entropy_score`;--> statement-breakpoint
DROP TABLE `global_entropy_score`;--> statement-breakpoint
ALTER TABLE `__new_global_entropy_score` RENAME TO `global_entropy_score`;--> statement-breakpoint
PRAGMA foreign_keys=ON;