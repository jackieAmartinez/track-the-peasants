-- Creates databases
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Table for dept
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    deptName VARCHAR(30) NOT NULL
);

-- Table for job titles
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL, 
    departmentId INT NOT NULL,
    FOREIGN KEY (departmentId)
    REFERENCES department(id)
);

-- Table with individual emp info
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    roleId INT,
    FOREIGN KEY (roleId)
    REFERENCES role(id),
    managerId INT,
    FOREIGN KEY (managerId)
    REFERENCES employee(id)
);


