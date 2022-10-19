const { addGame } = require("./addGame.js");
const express = require("express");
const { query } = require("./db");
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

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

app.get("/test", (req, res) => {
    res.status(200).send("OK");
});

// api gets all games with player info with a given fen
app.get("/api/games/:fen", async (req, res) => {
    const fen = req.params.fen;
    console.log(fen);
    const results = await query({
        sql: `SELECT event, site, date, white_elo, black_elo, result, white.name, black.name FROM positions
        JOIN games ON positions.game_id = games.id
        JOIN players AS white ON games.white_id = white.id
        JOIN players AS black ON games.black_id = black.id
        WHERE fen = ?`,
        values: [fen],
        nestTables: true
    });
    console.log(results);
    res.send(results);
});

app.listen(process.env.PORT || 5000);
