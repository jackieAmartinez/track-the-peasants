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
const viewAllPositions = `
SELECT position.title, position.salary, dept.deptName
    FROM role
    JOIN department ON d.id = p.deptartmentId;
`;

// Query passed through to view employees and their associated roles 
const viewEmployeeQuery =
`SELECT e.firstName, e.lastName, position.title, position.salary, d.deptName, concat(manager.firstName, ' ', manager.lastName) AS managerName
FROM employee
JOIN position p ON e.positionId = p.positionId
JOIN department d ON p.deptartmentId = p.deptId
LEFT JOIN employeeManager e ON e.employeeMngId = employee.managerId
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
                message: "What is the title of the position would you like to add?",
                name: "position"
            },
            {
                type: "input",
                message: "What is the annual salary for this position?",
                name: "salary"
            },
            {
                type: "input",
                message: "What is the department ID?",
                name: "deptId"
            }
        ])
        .then(answers => {
            db.query("INSERT INTO POSITION (title, salary, deptId) VALUES (?, ?, ?)", 
            [answers.role, answers.salary, answers.deptId], (err, dataRes) => {
                mainMenu();
            })
        })
}


// Function to add a employee
function addNewEmployee(){
    db.query("SELECT * FROM POSITION", (err, data)=> {
        const positions = data.map(row => {
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
                message: "What is the employee's position",
                name: "positionId",
                choices: positions
            },
            {
                type: "input",
                message: "What is the manager id? (if manager enter NULL)",
                name: "employeeMngId"
            }
        ])
        .then(answers => {
            db.query("INSERT INTO employee (firstName, lastName, positionId, employeeMngId) VALUES (?, ?, ?, ?)", 
            [answers.firstName, answers.lastName, answers.positionId, answers.employeeMngId], (err, dataRes) => {
                mainMenu();
            })
        })
    })
}

// Function to update employee role
function updatePosition(){
    db.query("SELECT * FROM EMPLOYEE", (err, data)=> {
        const employees = data.map(row => { 
            return {name: `${row.firstName} ${row.lastName}`, value: row.id}
        });
    db.query("SELECT * FROM POSITION", (err, data) => {
        const newPosition = data.map(row => {
            return {name: row.title, value: row.id}
        });
        console.log(employees)
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's position would you like to update?",
                name: "employeeUpdate",
                choices: employees
            },
            {
                type: "list",
                message: "What position would you like to assign the selected employee?",
                name: "newPosition",
                choices: newPosition
            }
        ])
        .then(answers => {
            console.log(answers)
            db.query("UPDATE employee SET positionId = ? WHERE id = ?", [answers.newPosition, answers.employeeUpdate], (err, data)=> {
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
            case "View all Departments":
                db.query("SELECT * FROM departments;", (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "View all Positions":
                db.query(viewAllPositions, (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "View all Employees":
                db.query(viewEmployeeQuery, (err, dataRes) => {
                    console.table(dataRes);
                    mainMenu();
                });
                break;
            case "Add a Department":
                addDept();
                break;
            case "Add a Position":
                addPosition();
                break;
            case "Add an Employee":
                addNewEmployee();
                break;
            case "Update an Employee's Position":
                updatePosition();
                break;
                default:
                    console.log("Ope, let's tru again.");
                    mainMenu();
                    break;
            }
        });
}
mainMenu()