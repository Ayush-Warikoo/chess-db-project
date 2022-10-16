const { pool, query } = require("./db");

const loadSampleData = async () => {
  await query("insert into players (name) values (?), (?)", ["kevin", "ayush"]);
  pool.end();
  console.log("Done loading sample data!");
};

loadSampleData();
