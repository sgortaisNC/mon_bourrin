-- CreateTable
CREATE TABLE `Brute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `hp` INTEGER NOT NULL,
    `force` INTEGER NOT NULL,
    `endurance` INTEGER NOT NULL,
    `agilite` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
