CREATE TABLE `assets` (
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`hash` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`type` text NOT NULL
);
