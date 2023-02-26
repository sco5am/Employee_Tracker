const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dns3661",
  database: "employee_db",
});
db.connect(function (err) {
    if (err) {
      throw err;
    }
    console.log("Connected to Database");
    // Function call to initialize app
    init();
  });
  
  const query = promisify(db.query).bind(db);
  
  function init() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "options",
          message: "What would you like to do?",
          choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit",
          ],
        },
      ])
      .then(function (userInput) {
        switch (userInput.options) {
          case "View All Departments":
            viewDept();
            break;
          case "View All Roles":
            viewRole();
            break;
          case "View All Employees":
            viewEmp();
            break;
          case "Add Department":
            addDept();
            break;
          case "Add Role":
            addRole();
            break;
          case "Add Employee":
            addEmp();
            break;
          case "Update Employee Role":
            updateRole();
            break;
          default:
            connection.end();
    
        }
      });
  }
  
  function viewDept() {
    db.query(
      "SELECT department.id AS id, department.name AS department FROM department",
      function (err, results) {
        if (err) {
          throw err;
        }
        console.table(results);
        init();
      }
    );
  }
  
  function viewEmp() {
    db.query(
      `SELECT employee.id,employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
  FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`,
      function (err, results) {
        if (err) {
          throw err;
        }
        console.table(results);
        init();
      }
    );
  }
  
  function viewRole() {
    db.query(
      `SELECT role.id, role.title, department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`,
      function (err, results) {
        if (err) {
          throw err;
        }
        console.table(results);
        init();
      }
    );
  }
  
  function addDept() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "addDept",
          message: "What department would you like to add?",
        },
      ])
      .then(function (userInput) {
        db.query(
          "INSERT INTO department SET ?",
          { name: userInput.addDept },
          function (err, results) {
            if (err) {
              throw err;
            }
            console.table(results);
            init();
          }
        );
      });
  }
  
  function addEmp() {
    getManagers()
      .then((managers) => {
        return getRoles().then((roles) => {
          return { managers, roles };
        });
      })
      .then(({ managers, roles }) =>
        inquirer.prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the first name of new employee?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the last name of new employee?",
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the role of new employee?",
            choices: roles,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Who is the manager of new employee?",
            choices: managers,
          },
        ])
      )
      .then(function (userInput) {
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: userInput.first_name,
            last_name: userInput.last_name,
            role_id: userInput.role_id,
            manager_id: userInput.manager_id,
          },
          function (err, results) {
            if (err) {
              throw err;
            }
            console.table(results);
            init();
          }
        );
      });
  }
  
  function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What role would you like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?",
        },
      ])
      .then(function (userInput) {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: userInput.title,
            salary: userInput.salary,
          },
          function (err, results) {
            if (err) {
              throw err;
            }
            console.table(results);
            init();
          }
        );
      });
  }
  
  function updateRole() {
    getEmployees()
      .then((employees) => {
        return getRoles().then((roles) => {
          return { employees, roles };
        });
      })
      .then(({ employees, roles }) =>
        inquirer.prompt([
          {
            type: "list",
            name: "employeeOptions",
            message: "Which employee would you like to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "newTitle",
            message: "What is the new role would you like to update to?",
            choices: roles,
          },
          {
            type: "input",
            name: "newSalary",
            message: "What is the new salary of this role?",
          }
        ])
      )
      .then(function (userInput) {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: userInput.newTitle,
            salary: userInput.newSalary,
          },
          function (err, results) {
            if (err) {
              throw err;
            }
            console.table(results);
            init();
          }
        );
      });
  }
  
  async function getRoles() {
    const data = await query("SELECT id, title FROM role");
    return data.map(({ id, title }) => ({ value: id, name: title }));
  }
  
  async function getManagers() {
    const data = await query(
      "SELECT m.id, m.first_name, m.last_name FROM employee as m INNER JOIN employee as e ON m.id = e.manager_id"
    );
    return data.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
  }
  
  async function getEmployees() {
    const data = await query("SELECT id, first_name, last_name FROM employee");
    return data.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
  }