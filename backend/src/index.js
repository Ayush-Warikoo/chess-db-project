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

app.get("/api/table", async (req, res) => {
    const whitePlayer = req.query.whitePlayer;
    const blackPlayer = req.query.blackPlayer;
    const minElo = req.query.minElo || 0;
    const event = req.query.event;
    const result = req.query.result;
    params = [whitePlayer, blackPlayer, event, result];
    values = [minElo, minElo];
    let sqlQuery = "SELECT * FROM games";
    sqlQuery += " JOIN players AS white ON games.white_id=white.id";
    sqlQuery += " JOIN players AS black ON games.black_id=black.id";

    sqlQuery += " WHERE (games.white_elo >= ? OR games.black_elo >= ?)";

    // Dynamically modify query based on what filter parameters were given
    // If parameter is empty string it was not given by user, so we do not filter on it.
    if(whitePlayer != ""){
          sqlQuery += " AND white.name = ?";
          values.push(whitePlayer);
    }
    if(blackPlayer != ""){
        sqlQuery += " AND black.name = ?";
        values.push(blackPlayer);
    }
    if(event != "") {
        sqlQuery += " AND games.event = ?";
        values.push(event);
    }
    if(result != "") {
        sqlQuery += " AND games.result = ?";
        values.push(result);
    }

    const results = await query({
         sql: sqlQuery,
         values: values,
         nestTables: true
     });

     formattedResults = []
     for(let i = 0; i < results.length; i++){
        entry = {}
        entry.id = results[i].games.id;
        entry.date = results[i].games.date;
        entry.white_player = results[i].white.name;
        entry.white_elo = results[i].games.white_elo;
        entry.black_player = results[i].black.name;
        entry.black_elo = results[i].games.white_elo;
        entry.result = results[i].games.result;
        entry.event = results[i].games.event;
        entry.site = results[i].games.site;
        formattedResults.push(entry);
     }
     res.send(formattedResults);

    // *game_id should be sent as id for the frontend
    // FORMAT OF HOW TO SEND RESULTS TO FRONTEND:
    // res.send([{id: 1, date: "2020-01-01", white_player: "Magnus Carlsen", white_elo: 1000, black_player: "Hans Neimann", black_elo: 1000, result: "black", event: "event", site: "site"}]);
});

app.listen(process.env.PORT || 5000);
