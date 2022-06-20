// 引用mysql
const mysql = require('mysql');
// 应用配置文件
const config = require('./../config/config.json');

const mysqlClient = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    timezone: '+8:00'
});

module.exports = mysqlClient;