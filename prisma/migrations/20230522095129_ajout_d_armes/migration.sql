-- CreateTable
CREATE TABLE `Arme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tauxDeCritique` DOUBLE NOT NULL,
    `multiplicateurCritique` DOUBLE NOT NULL,
    `poids` DOUBLE NOT NULL,
    `modificateurDegats` DOUBLE NOT NULL,
    `bruteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Arme` ADD CONSTRAINT `Arme_bruteId_fkey` FOREIGN KEY (`bruteId`) REFERENCES `Brute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
