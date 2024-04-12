CREATE DATABASE IF NOT EXISTS `database_name`;

USE `database_name`;

CREATE TABLE IF NOT EXISTS `Users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(150) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false
)

CREATE TABLE IF NOT EXISTS `Products` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `imageUrl` VARCHAR(150) NOT NULL,
    `categoryId` INT NOT NULL,
    `stock` INT NOT NULL,
    `imagePublicId` VARCHAR(150) NOT NULL

    FOREIGN KEY (categoryId) REFERENCES ProductCategories(id)
)

CREATE TABLE IF NOT EXISTS `ProductCategories` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `name` VARCHAR(50) NOT NULL
)

CREATE TABLE IF NOT EXISTS `ProductImages` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `productId` INT NOT NULL,
    `imageUrl` VARCHAR(150) NOT NULL,
    `imagePublicId` VARCHAR(150) NOT NULL

    FOREIGN KEY (productId) REFERENCES Products(id)
)

CREATE TABLE IF NOT EXISTS `Address` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `userId` INT NOT NULL,
    `address` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `postalCode` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,

    FOREIGN KEY (userId) REFERENCES Users(id)
)

CREATE TABLE IF NOT EXISTS `PaymentMethods` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `name` VARCHAR(50) NOT NULL
)

CREATE TABLE IF NOT EXISTS `Orders` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `userId` INT NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    FOREIGN KEY (userId) REFERENCES Users(id)
)

CREATE TABLE IF NOT EXISTS `OrderDetails` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    `orderId` INT NOT NULL,
    `productId` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `paymentMethodId` INT NOT NULL,

    FOREIGN KEY (paymentMethodId) REFERENCES PaymentMethods(id),
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
)
