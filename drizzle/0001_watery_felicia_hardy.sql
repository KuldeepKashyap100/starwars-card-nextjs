CREATE TABLE `favorites` (
	`user_id` integer,
	`character_id` integer,
	PRIMARY KEY(`user_id`, `character_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
