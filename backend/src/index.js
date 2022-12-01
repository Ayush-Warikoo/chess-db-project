const { addGame } = require("./addGame.js");
const express = require("express");
const { query } = require("./db");
const cors = require("cors");
const Engine = require("node-uci").Engine;
var validator = require("validator");
var escape = require("sql-escape");
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
var engine1;

async function initEngine() {
    engine1 = new Engine(process.env.STOCK_FISH_ENG_PATH);
    await engine1.init();
    await engine1.setoption('MultiPv', '4');
    await engine1.setoption('Skill Level', '20');
}

initEngine();

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

function sanitizeString(queryString) {
  let escapedString = escape(queryString);
  console.log(escapedString);
  return escapedString;
}

app.get("/", async (req, res) => {
  console.log(process.env.DB_USER);
  const results = await query("select * from positions");
  //   console.log(results);
  res.send(results);
});

app.get("/players/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const results = await query("select * from players where name = ?", [name]);
    if (!results.length) {
      return res
        .status(404)
        .send({ error: "could not find player with that name" });
    }
    res.send(results[0]);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "server error" });
  }
});

app.put("/players/:name", async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.params;

    const columnsToUpdate = [];
    const updateValues = [];
    ["profile_pic_url", "bio", "birth_date"].forEach((column) => {
      if (req.body[column] !== undefined) {
        columnsToUpdate.push(column);
        updateValues.push(req.body[column]);
      }
    });

    const setClause = columnsToUpdate
      .map((column) => `${column} = ?`)
      .join(", ");

    const updateStatement = `update players set ${setClause} where name = ?`;
    const results = await query(updateStatement, [...updateValues, name]);
    res.send(results);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "server error" });
  }
});

app.post("/api/addGame", async (req, res) => {
  const results = await addGame(req.body.str);
  res.send(results);
});

app.get("/engineAnalysis/:fen", async (req, res) => {
    try{
        let ret = await engine1.isready();
        await engine1.position(sanitizeString(req.params.fen));
        const result = await engine1.go({depth: 15});
        console.log(result.bestmove);
        let resVal;
        let maxCenti = -9999;
        for(let i = 1; i < result.info.length; i++){
            console.log(result.info.at(i));
            if(result.info.at(i).pv && result.info.at(i).pv.split(" ")[0] == result.bestmove && result.info.at(i).score.value >= maxCenti) {
                resVal = result.info.at(i);
                maxCenti = result.info.at(i).score.value;
            }
        }
        console.log(resVal);
        res.status(200).send(resVal);
    } catch (e) {
        console.log(e);
        res.status(500).send({error: "server error"});
    }
});

app.post("/api/games/removeGame", async (req, res) => {
  const id = req.body.id;
  await query("delete from positions where game_id = ?", [id]);
  await query("delete from games where id = ?", [id]);
  res.status(200).send("OK");
});

app.get("/test", (req, res) => {
  res.status(200).send("OK");
});

// api gets all games with player info with a given fen
app.get("/api/games/:fen", async (req, res) => {
  const fen = sanitizeString(req.params.fen);
  const results = await query({
    sql: `SELECT event, site, date, white_elo, black_elo, result, next_move, white.name, black.name FROM positions
        JOIN games ON positions.game_id = games.id
        JOIN players AS white ON games.white_id = white.id
        JOIN players AS black ON games.black_id = black.id
        WHERE fen = ?
        LIMIT 20`,
    values: [fen],
    nestTables: true,
  });
  console.log(results);
  res.send(results);
});

// api gets the win rate of all the games with a given fen
app.get("/api/games/:fen/winrate", async (req, res) => {
  const fen = sanitizeString(req.params.fen);
  console.log(fen);
  console.log(req.params.fen);
  const results = await query({
    sql: `SELECT result, COUNT(*) AS count FROM positions
        JOIN games ON positions.game_id = games.id
        WHERE fen = ?
        GROUP BY result`,
    values: [fen],
    nestTables: true,
  });
  const winRateResult = { white: 0, black: 0, draw: 0 };
  results.forEach((item) => {
    winRateResult[item.games.result] = item[""].count;
  });
  console.log(winRateResult);
  res.send(winRateResult);
});

app.get("/api/table", async (req, res) => {
  try {
    const whitePlayer = sanitizeString(req.query.whitePlayer);
    const blackPlayer = sanitizeString(req.query.blackPlayer);
    const minElo = sanitizeString(req.query.minElo) || 0;
    const event = sanitizeString(req.query.event);
    const result = sanitizeString(req.query.result);
    const ecoCode = sanitizeString(req.query.ecoCode);
    params = [whitePlayer, blackPlayer, event, result];
    values = [minElo, minElo];
    let sqlQuery = "SELECT * FROM games";
    sqlQuery += " JOIN players AS white ON games.white_id=white.id";
    sqlQuery += " JOIN players AS black ON games.black_id=black.id";
    sqlQuery += " WHERE (games.white_elo >= ? OR games.black_elo >= ?)";

    // Dynamically modify query based on what filter parameters were given
    // If parameter is empty string it was not given by user, so we do not filter on it.
    if (whitePlayer !== "") {
      sqlQuery += " AND white.name = ?";
      values.push(whitePlayer);
    }
    if (blackPlayer !== "") {
      sqlQuery += " AND black.name = ?";
      values.push(blackPlayer);
    }
    if (event !== "") {
      sqlQuery += " AND games.event = ?";
      values.push(event);
    }
    if (result !== "") {
      sqlQuery += " AND games.result = ?";
      values.push(result);
    }
    if (ecoCode !== "") {
      if (ecoCode.length > 3 || ecoCode.length == 1) {
        res.status(400).send({ error: "invalid ecoCode length" });
        return;
      }
      let eco_category = ecoCode.substring(0, 1);
      let eco_subcategory = ecoCode.substring(1);
      sqlQuery += " AND games.eco_category = ? AND games.eco_subcategory = ?";
      values.push(eco_category);
      values.push(parseInt(eco_subcategory));
    }

    sqlQuery += " LIMIT 50"; // only return 10 rows

    const results = await query({
      sql: sqlQuery,
      values: values,
      nestTables: true,
    });

    formattedResults = [];
    for (let i = 0; i < results.length; i++) {
      entry = {};
      entry.id = results[i].games.id;
      entry.date = results[i].games.date;
      entry.white_player = results[i].white.name;
      entry.white_elo = results[i].games.white_elo;
      entry.black_player = results[i].black.name;
      entry.black_elo = results[i].games.black_elo;
      entry.result = results[i].games.result;
      entry.event = results[i].games.event;
      entry.site = results[i].games.site;
      entry.eco_code =
        results[i].games.eco_category +
        results[i].games.eco_subcategory?.toString();
      formattedResults.push(entry);
    }
    console.log(formattedResults, sqlQuery, minElo);
    res.send(formattedResults);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server error" });
  }
  // *game_id should be sent as id for the frontend
  // FORMAT OF HOW TO SEND RESULTS TO FRONTEND:
  // res.send([{id: 1, date: "2020-01-01", white_player: "Magnus Carlsen", white_elo: 1000, black_player: "Hans Neimann", black_elo: 1000, result: "black", event: "event", site: "site"}]);
});

app.listen(process.env.PORT || 5000);
