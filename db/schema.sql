-- Creates databases
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Table for dept
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deptName VARCHAR(30) NOT NULL
);

-- Table for job titles
CREATE TABLE position (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL, 
    deptartmentId INT NOT NULL,
    
    FOREIGN KEY (deptartmentId)
    REFERENCES department(id)
);

-- Table with individual emp info
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    positionId INT,
    FOREIGN KEY (positionId)
    REFERENCES position(id),
    managerId INT,
    FOREIGN KEY (managerId)
    REFERENCES employee(id)
);


