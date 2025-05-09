-- CreateTable
CREATE TABLE `Client` (
    `user_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `car_id` VARCHAR(191) NOT NULL,
    `type` ENUM('Sports', 'Sedan', 'Coupe', 'Electric', 'Hybrid', 'Luxury') NOT NULL DEFAULT 'Luxury',
    `status` VARCHAR(191) NOT NULL,
    `gear_box` VARCHAR(191) NOT NULL,
    `seats` INTEGER NOT NULL,
    `distance` DOUBLE NOT NULL,
    `air_conditioner` BOOLEAN NOT NULL,
    `price_per_day` DOUBLE NOT NULL,

    PRIMARY KEY (`car_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CARS_IN_RENT` (
    `rent_id` VARCHAR(191) NOT NULL,
    `car_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `rental_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CARS_IN_RENT` ADD CONSTRAINT `CARS_IN_RENT_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `Car`(`car_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CARS_IN_RENT` ADD CONSTRAINT `CARS_IN_RENT_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
