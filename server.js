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
SELECT r.title, r.salary, d.department_name
    FROM role
    JOIN department d ON d.id = r.department_id;
`;

// Query passed through to view employees and their associated roles 
const viewEmployeeQuery =
`
SELECT e.first_name, e.last_name, r.title, r.salary, d.department_name, concat(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e 
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id
`

// functions to add dept, role, & employee
function addDept(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "What department would you like to add?",
                name: "addDept"
            },
        ])
        .then(answers => {
            db.query("INSERT INTO DEPARTMENT (department_name) VALUES (?)", 
            [answers.addDep], (err, dataRes) => {
                main();
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
            db.query("INSERT INTO ROLE (title, salary, department_id) VALUES (?, ?, ?)", 
            [answers.role, answers.salary, answers.deptId], (err, dataRes) => {
                main();
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
                main();
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
                main();
            })
        })
    })
})
}

// Main function called in program, gives the user a list of choices
// inside node terminal with the above scripts
function main() {
    inquirer
        .prompt([
        {
            type: 'list',
            message: 'What would you like to choose?',
            name: 'action',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add a employee',
                'update a employee role'
            ],
        },
    ])
        .then((answers)=> {
        switch (answers.action) {
            case "view all departments":
                db.query("SELECT * FROM department;", (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case "view all roles":
                db.query(viewAllRoles, (err, dataRes) => {
                    console.table(dataRes);
                    main();
                });
                break;
            case "view all employees":
                db.query(viewEmployeeQuery, (err, dataRes) => {
                    console.table(dataRes);
                    main();
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
                    main();
                    break;
            }
        });
}
main()