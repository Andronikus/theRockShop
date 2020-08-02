const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  host: "localhost",
  user: "user",
  database: "shop",
  password: "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connectionPool.promise();
