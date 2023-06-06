-- Creates databases
DROP DATABASE IF EXISTS emp_db;
CREATE DATABASE emp_db;

USE emp_db;

-- Table for dept
CREATE TABLE dept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_area VARCHAR(30) NOT NULL
);

-- Table for job titles
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL, 
    dept_id INT NOT NULL,
    
    FOREIGN KEY (dept_id)
    REFERENCES dept(id)
);

-- Table with individual emp info
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(id),
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);