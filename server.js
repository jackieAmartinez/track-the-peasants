// Required packages and dependenci
const inquirer = require('inquirer');
const mysql = require('mysql2');
// require("console.table");

// set up sql server
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'Penel0pe!!',
    database: 'employee_db'
});

// Query that i pass through as a variable to view roles
// variable for viewing & connecting tables
const viewAllRoles = `
SELECT position.title, position.salary, dept.deptName
    FROM role
    JOIN department ON d.id = position.deptId;
`;

// Query passed through to view employees and their associated roles 
const viewEmployeeQuery =
`SELECT emp.firstName, emp.lastName, position.title, position.salary, dept.deptName, concat(manager.firstName, ' ', manager.lastName) AS managerName
FROM employee
JOIN role ON roleId = employee.positionId
JOIN department ON deptartmentId = position.deptId
LEFT JOIN employee manager ON employeeMngId = employee.managerId
`;

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
function addPosition(){
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
            db.query("INSERT INTO ROLE (title, salary, deptId) VALUES (?, ?, ?)", 
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
                message: "What is the employees first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employees last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role",
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
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", 
            [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, dataRes) => {
                mainMenu();
            })
        })
    })
}

// Function to update employee role
function updatePosition(){
    db.query("SELECT * FROM employee", (err, data)=> {
        const employees = data.map(row => { 
            return {name: `${row.first_name} ${row.last_name}`, value: row.id}
        });
    db.query("SELECT * FROM role", (err, data) => {
        const newRole = data.map(row => {
            return {name: row.title, value: row.id}
        });
        console.log(employees)
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's role would you like to update?",
                name: "employeeUpdate",
                choices: employees
            },
            {
                type: "list",
                message: "What role would you like to assign the selected employee?",
                name: "newRole",
                choices: newRole
            }
        ])
        .then(answers => {
            console.log(answers)
            db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.newRole, answers.employeeUpdate], (err, data)=> {
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
                'View all Positions',
                'View all Employees',
                'Add a Department',
                'Add a Position',
                'Add an Employee',
                'Update Employee Position'
            ],
        },
    ])
        .then((answers)=> {
        switch (answers.action) {
            case "view all departments":
                db.query("SELECT * FROM departments;", (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "view all roles":
                db.query(viewAllRoles, (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "view all employees":
                db.query(viewEmployeeQuery, (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "add a department":
                addDept();
                break;
            case "add a role":
                addPosition();
                break;
            case "add a employee":
                addNewEmployee();
                break;
            case "update a employee's role":
                updatePosition();
                break;
                default:
                    console.log("Invalid action.");
                    mainMenu();
                    break;
            }
        });
}
mainMenu()