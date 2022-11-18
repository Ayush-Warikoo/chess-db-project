const { pool, query } = require("./db.js");
const { addGame } = require("./addGame.js");
const fs = require("fs");
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });


const testProdData = async () => {
    console.log("Selected by Fen Test:");
    await readline.question('Fen Input', async fen => {
        const selectByFen = await query({
            sql: `SELECT event, site, date, white_elo, black_elo, result, white.name, black.name FROM positions
            JOIN games ON positions.game_id = games.id
            JOIN players AS white ON games.white_id = white.id
            JOIN players AS black ON games.black_id = black.id
            WHERE fen = ?`,
            values: [fen],
            nestTables: true
          });
        
        
        console.log(selectByFen);
        readline.close();
      });


      await console.log("Win Rate Result Test:");
          readline.question('Fen Input', async fen => {
            const winResults = await query({
                sql: `SELECT result, COUNT(*) AS count FROM positions
                JOIN games ON positions.game_id = games.id
                WHERE fen = ?
                GROUP BY result`,
                values: [fen],
                nestTables: true
              });
              const winRateResult = {'white': 0, 'black': 0, 'draw': 0};
              winResults.forEach((item) => {
                  winRateResult[item.games.result] = item[""].count;
              });

              console.log(winRateResult);
            
              readline.close();
            });


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

  pool.end();
  console.log("Done testing prod data!");
};

testProdData();
