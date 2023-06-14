// Required packages and dependenci
const inquirer = require('inquirer');
const mysql = require('mysql2');
// require("console.table");

// set up sql server
const db = mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: 'Penel0pe!!',
    database: 'employee_db'
});

// Query that i pass through as a variable to view roles
// variable for viewing & connecting tables
const viewAllRoles = `
SELECT role.title, role.salary, role.departmentId
    FROM role
    JOIN department ON d.id = r.departmentId
`;

// // Query passed through to view employees and their associated roles 
// const viewEmployeeQuery =
// `SELECT e.firstName, e.lastName, role.title, role.salary, d.deptName, concat(manager.firstName, ' ', manager.lastName) AS managerName
// FROM employee
// JOIN role p ON e.roleId = p.roleId
// JOIN department d ON p.departmentId = p.deptId
// LEFT JOIN employeeManager e ON e.employeeMngId = employee.managerId
// `;

// Query passed through to view employees and their associated roles 
const viewEmployeeQuery =
`SELECT e.firstName, e.lastName, role.title, role.salary, d.deptName, concat(manager.firstName, ' ', manager.lastName) AS managerName
FROM employee
JOIN role r ON e.roleId = role.id
JOIN department d ON r.departmentId = dept.id
LEFT JOIN employee m ON employee.managerId = m.id
`;

function quit() {
    // console.log(“Goodbye!“);
    process.exit();
  }


// functions to add dept, role, & employee
function addDept(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter new department name:",
                name: "addDept"
            },
        ])
        .then(answers => {
            db.query("INSERT INTO DEPARTMENT (deptName) VALUES (?)", 
            [answers.addDept], (err, dataRes) => {
                mainMenu();
            })
        })
}

// Function to add a role
function addRole(){
    inquirer
        .prompt ([
            {
                type: "input",
                message: "What is the title of the role would you like to add?",
                name: "role"
            },
            {
                type: "input",
                message: "What is the annual salary for this role?",
                name: "salary"
            },
            {
                type: "input",
                message: "What is the department ID?",
                name: "deptId"
            }
        ])
        .then(answers => {
            db.query("INSERT INTO ROLE (title, salary, departmentId) VALUES (?, ?, ?)", 
            [answers.role, answers.salary, answers.deptId], (err, dataRes) => {
                mainMenu();
            })
        })
}


// Function to add a employee
function addNewEmployee(){
    db.query("SELECT * FROM ROLE", (err, data)=> {
        const roles = data.map(row => {
            return {name: row.title, value: row.id}
        })
        inquirer
        .prompt ([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "roleId",
                choices: roles
            },
            {
                type: "input",
                message: "What is the manager id? (if manager enter NULL)",
                name: "managerId"
            }
        ])
        .then(answers => {
            db.query("INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)", 
            [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, dataRes) => {
                mainMenu();
            })
        })
    })
}

// Function to update employee role
function updateRole(){
    db.query("SELECT * FROM employee", (err, data) => {
        const employees = data.map((row) => { 
            return { name: `${row.firstName} ${row.lastName}`, value: row.id};
        });
    db.query("SELECT * FROM role", (err, data) => {
        const newRole = data.map((row) => {
            return { name: row.title, value: row.id};
        });
        console.log(employees)
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's role would you like to update?",
                name: "employeeUpdate",
                choices: employees,
            },
            {
                type: "list",
                message: "What role would you like to assign the selected employee?",
                name: "newRole",
                choices: newRole,
            },
        ])
        .then((answers) => {
            console.log(answers)
            db.query(
                "UPDATE employee SET roleId = ? WHERE id = ?",
                [answers.newRole, answers.employeeUpdate],
                (err, data) => {
                mainMenu();
            })
        })
    })
})
}

// Main function called in program, gives the user a list of choices
// inside node terminal with the above scripts
function mainMenu() {
    inquirer
        .prompt([
        {
            type: 'list',
            message: 'Select your next task from the following options:',
            name: 'action',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Quit'
            ],
        },
    ])
        .then((answers)=> {
        switch (answers.action) {
            case "View all Departments":
                db.query("SELECT * FROM department;", (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "View all Roles":
                db.query("SELECT * FROM role;", (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "View all Employees":
                db.query("SELECT * FROM employee;", (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "Add a Department":
                addDept();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addNewEmployee();
                break;
            case "Update an Employee Role":
                updateRole();
                break;
                default:
                    console.log("Ope, let's try again.");
                    mainMenu();
                    break;
            case "Quit":
                quit();
            }
        });
}
mainMenu()