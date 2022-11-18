const { pool, query } = require("./db.js");
const { addGame } = require("./addGame.js");
const fs = require("fs");
const path = require('path');


const loadSampleData = async () => {

  console.log("Loading sample data!");

  const names = fs.readdirSync('res', {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name);

  for (var i = 0; i < names.length; i++) {
    const buffer = fs.readFileSync("res/" + names[i]);
    const results = await addGame(buffer.toString());
  }

  const selectByFen = await query({
    sql: `SELECT event, site, date, white_elo, black_elo, result, white.name, black.name FROM positions
    JOIN games ON positions.game_id = games.id
    JOIN players AS white ON games.white_id = white.id
    JOIN players AS black ON games.black_id = black.id
    WHERE fen = ?`,
    values: ["8/2p4k/4p3/3nP1p1/2pP4/p1P2P2/8/6RK w - - 0 47"],
    nestTables: true
  });

  console.log("Selected by Fen Test:");
  console.log(selectByFen);

  const winResults = await query({
    sql: `SELECT result, COUNT(*) AS count FROM positions
    JOIN games ON positions.game_id = games.id
    WHERE fen = ?
    GROUP BY result`,
    values: ["8/2p4k/4p3/3nP1p1/2pP4/p1P2P2/8/6RK w - - 0 47"],
    nestTables: true
  });
  const winRateResult = {'white': 0, 'black': 0, 'draw': 0};
  winResults.forEach((item) => {
      winRateResult[item.games.result] = item[""].count;
  });

  console.log("Win Rate Result Test:");
  console.log(winRateResult);

  const whitePlayer = "";
  const blackPlayer = "";
  const minElo = 0;
  const event = "";
  const result = "black";

  params = [whitePlayer, blackPlayer, event, result];
    values = [minElo, minElo];
    let sqlQuery = "SELECT * FROM games";
    sqlQuery += " JOIN players AS white ON games.white_id=white.id";
    sqlQuery += " JOIN players AS black ON games.black_id=black.id";

    sqlQuery += " WHERE (games.white_elo >= ? OR games.black_elo >= ?)";

    if(whitePlayer !== ""){
          sqlQuery += " AND white.name = ?";
          values.push(whitePlayer);
    }
    if(blackPlayer !== ""){
        sqlQuery += " AND black.name = ?";
        values.push(blackPlayer);
    }
    if(event !== "") {
        sqlQuery += " AND games.event = ?";
        values.push(event);
    }
    if(result !== "") {
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

     console.log("Selected by Black Victories:");
     console.log(formattedResults);
  
  const updatePlayerQuery = 'update players set profile_pic_url = ?, birth_date = ?, bio = ? where name = ?'
  const updatePlayerResult = await query(updatePlayerQuery, [
    'https://c8.alamy.com/comp/2GJ8N1M/oslo-20140506-magnus-carlsen-norwegian-world-champion-in-chess-foto-hannes-holmstrom-dn-tt-kod-3000-2GJ8N1M.jpg',
    '1990-11-30',
    'I am simply the best',
    'mmjme'
  ])
  console.log("Update Player Test:");
  console.log(updatePlayerResult)

  pool.end();
  console.log("Done loading sample data!");
};

loadSampleData();
