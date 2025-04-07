PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_academy_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`location` text,
	`description` text,
	`founded_year` integer,
	`website` text,
	`is_verified` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_academy_profiles`("id", "user_id", "name", "location", "description", "founded_year", "website", "is_verified") SELECT "id", "user_id", "name", "location", "description", "founded_year", "website", "is_verified" FROM `academy_profiles`;--> statement-breakpoint
DROP TABLE `academy_profiles`;--> statement-breakpoint
ALTER TABLE `__new_academy_profiles` RENAME TO `academy_profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_id` integer NOT NULL,
	`receiver_id` integer NOT NULL,
	`content` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "sender_id", "receiver_id", "content", "is_read", "created_at") SELECT "id", "sender_id", "receiver_id", "content", "is_read", "created_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE TABLE `__new_player_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`position` text,
	`age` integer,
	`location` text,
	`bio` text,
	`achievements` text,
	`overall_rating` integer,
	`appearances` integer,
	`goals` integer,
	`is_elite_prospect` integer DEFAULT false,
	`is_verified` integer DEFAULT false,
	`stats` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_player_profiles`("id", "user_id", "position", "age", "location", "bio", "achievements", "overall_rating", "appearances", "goals", "is_elite_prospect", "is_verified", "stats") SELECT "id", "user_id", "position", "age", "location", "bio", "achievements", "overall_rating", "appearances", "goals", "is_elite_prospect", "is_verified", "stats" FROM `player_profiles`;--> statement-breakpoint
DROP TABLE `player_profiles`;--> statement-breakpoint
ALTER TABLE `__new_player_profiles` RENAME TO `player_profiles`;--> statement-breakpoint
CREATE TABLE `__new_scout_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`organization` text,
	`position` text,
	`bio` text,
	`years_of_experience` integer,
	`is_verified` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_scout_profiles`("id", "user_id", "organization", "position", "bio", "years_of_experience", "is_verified") SELECT "id", "user_id", "organization", "position", "bio", "years_of_experience", "is_verified" FROM `scout_profiles`;--> statement-breakpoint
DROP TABLE `scout_profiles`;--> statement-breakpoint
ALTER TABLE `__new_scout_profiles` RENAME TO `scout_profiles`;