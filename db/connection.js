const mysql = require('mysql12');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dns3661',
    database: 'employees_db' 
});

module.exports = db;