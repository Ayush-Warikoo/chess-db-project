const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = (sql, options) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, options, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  pool,
  query,
};
