CREATE DATABASE IF NOT EXISTS pruebas-memo;

USE pruebas-memo;

CREATE TABLE IF NOT EXISTS `Users` (
    `id` INT NOT NULL AUTO_INCREMENT,  
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(50) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false
)

INSERT INTO `Users` (`firstName`, `lastName`, `email`, `password`, `admin`) VALUES ('Guillermo', 'Anguiano', 'jesus2001guillermo2@gmail.com', 'admin123456', true);