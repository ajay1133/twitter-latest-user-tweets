const mysql = require('mysql');
const config = require("../../config/config.json");

// Connect to db
const connectionObj = {
    host: config.db_host,
    user: config.db_user,
    password: config.db_password
};
const connection = mysql.createConnection(connectionObj);

module.exports = connection;