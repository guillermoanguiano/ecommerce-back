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

/* 
    Insert data in Users table
*/