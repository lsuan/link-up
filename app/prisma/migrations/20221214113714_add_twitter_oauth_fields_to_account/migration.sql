-- AlterTable
ALTER TABLE `Account` ADD COLUMN `oauth_token` TEXT NULL,
    ADD COLUMN `oauth_token_secret` TEXT NULL;
