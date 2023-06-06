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

-- Create the databases used for storing data 
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Table for the department i.e.
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

-- Table for the preset role that employee will fill
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);


-- Table for individual employee info
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