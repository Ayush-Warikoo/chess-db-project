const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("chess app");
});

app.listen(5000);
