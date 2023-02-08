const inquirer = require('inquirer')
const db = require('./db/connection')

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    employee_tracker();
});

function employee_tracker() {
inquirer.createPromptModule([{
    type: 'list',
    name: 'prompt',
    message: 'what would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
}]).then((answers) => {
    if (answers.prompt === 'View all departments') {
        db.query(`Select * from department`, (err, result) => {
            if (err) throw err;
            console.log('Viewing all departments: ');
            console.table(result);
            employee_tracker();
        });
    } else if (answers.prompt === 'View all roles') {
        db.query(`Select * from role`, (err, result) => {
            if (err) throw err;
            console.log('Viewing all roles: ');
            console.table(result);
            employee_tracker();
        });
    } else if (answers.prompt === 'View all employees') {
        db.query(`Select * from employee`, (err, result) => {
            if (err) throw err;
            console.log('Viewing all employees: ');
            console.table(result);
            employee_tracker();
        });
    } else if (answers.prompt === 'Add a department') {
        inquirer.prompt([{
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
            validate: departmentInput => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log('Please add a department!');
                    return false;
                }
            }
        }]). then
    }
})}
