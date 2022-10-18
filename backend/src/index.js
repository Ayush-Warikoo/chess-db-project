import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: 'env.default' });

import { query } from "./db.js";
import { addGame } from "./addGame.js"
const app = express();
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", async (req, res) => {
  console.log(process.env.DB_USER);
  const results = await query("select * from positions");
  console.log(results);
  res.send(results);
});

app.post("/addGame", async (req, res) => {
  const results = await addGame(req.body.str);
  res.send(results);
});

app.listen(process.env.PORT || 5000);