const express = require("express");
const { query } = require("./db");
const app = express();

app.get("/", async (req, res) => {
  const results = await query("select count(*) as tomato from players");
  res.send(results);
});

app.listen(process.env.PORT || 5000);
