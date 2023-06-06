INSERT INTO dept(dept_area)
VALUES ('Accounting'),
       ('Sales'),
       ('Customer Service'),
       ('Warehouse');

Insert INTO role(title, salary, dept_id)
VALUES  ('Accountant', 40000, 1),
        ('Sales Representative', 50000, 2),
        ('Manager', 100000, 2),
        ('Account Representative', 30000, 3),
        ('Warehouse Foreman', 85000, 4);

Insert INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Angela', 'Kinsey', 1, NULL),
       ('Dwight', 'Schrute', 2, NULL),
       ('Michael', 'Scott', 2, 1),
       ('Kelly', 'Kapoor', 1, NULL),
       ('Darryl', 'Philbin', 3, NULL);