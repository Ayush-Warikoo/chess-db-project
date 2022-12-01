const { pool, query } = require("./db.js");
const { addGame } = require("./addGame.js");
const fs = require("fs");
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });


const testProdData = async () => {

  await resetDatabase()

  console.log("Loading production data!");

  const names = fs.readdirSync('res/production', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name);
  var fileTexts = []
  var count = 0

  for (var i = 0; i < names.length; i++) {
    const buffer = fs.readFileSync("res/production/" + names[i]);

    let arr = buffer.toString().split(/\-0\s/);


    for (var i = 0; i < arr.length; i++) { 
        var element = arr[i]

        if (element.charAt(element.length - 2) !== '-') {
            element += "-0"
        }

        let inner = element.split(/\-1\s/)

        for (var j = 0; j < inner.length; j++) { 
            var e = inner[j]

            if (e.charAt(e.length - 2) !== '-') {
                e += "-1"
            }
            fileTexts.push(e)
        }
    }

    count += 1
    if (count === names.length) {
        for (var i = 0; i < fileTexts.length; i = i + 20) { 
          const results = await addGame(fileTexts.slice(i, i + 20));
        }
    }
  }

  const selectByFen = await query({
    sql: `SELECT event, site, date, white_elo, black_elo, result, white.name, black.name FROM positions
    JOIN games ON positions.game_id = games.id
    JOIN players AS white ON games.white_id = white.id
    JOIN players AS black ON games.black_id = black.id
    WHERE fen = ?`,
    values: ["rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2"],
    nestTables: true
  });

  console.log("Selected by Fen Test:");
  console.log(selectByFen.slice(0,10));

  const winResults = await query({
    sql: `SELECT result, COUNT(*) AS count FROM positions
    JOIN games ON positions.game_id = games.id
    WHERE fen = ?
    GROUP BY result`,
    values: ["rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2"],
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
     console.log(formattedResults.slice(0,10));
  
  const updatePlayerQuery = 'update players set profile_pic_url = ?, birth_date = ?, bio = ? where name = ?'
  const updatePlayerResult = await query(updatePlayerQuery, [
    'https://c8.alamy.com/comp/2GJ8N1M/oslo-20140506-magnus-carlsen-norwegian-world-champion-in-chess-foto-hannes-holmstrom-dn-tt-kod-3000-2GJ8N1M.jpg',
    '1990-11-30',
    'I am simply the best',
    'ArasanX'
  ])
  console.log("Update Player Test:");
  console.log(updatePlayerResult)

  pool.end();
  console.log("Done testing prod data!");
};

async function resetDatabase() {
  console.log("Resetting Database");

  const dropIndex = await query({
    sql: `alter table positions drop index fen_index;`,
    values: [],
    nestTables: true
  });

  const dropPositions = await query({
    sql: `
    drop table positions;`,
    values: [],
    nestTables: true
  });

  const dropGames = await query({
    sql: `
    drop table games;`,
    values: [],
    nestTables: true
  });

  const dropPlayers = await query({
    sql: `
    drop table players;`,
    values: [],
    nestTables: true
  });


  const createPlayerTable = await query({
    sql: `create table players (
      id int not null primary key auto_increment,
      name varchar(255) not null unique,
      profile_pic_url varchar(255),
      bio text,
      birth_date date
    );`,
    values: [],
    nestTables: true
  });

  const createGamesTable = await query({
    sql: `create table games (
      id int not null primary key auto_increment,
      event varchar(255) not null,
      site varchar(255) not null,
      date date not null,
      main_time int not null check (0 <= main_time),
      increment_time int not null check (0 <= increment_time),
      white_id int not null,
      black_id int not null,
      white_elo int not null check (0 <= white_elo),
      black_elo int not null check (0 <= black_elo),
      result enum('white', 'black', 'draw') not null,
      eco_category enum('A', 'B', 'C', 'D', 'E'),
      eco_subcategory int check (0 <= eco_subcategory and eco_subcategory <= 99),
      plycount int not null check (0 <= plycount),
    
      constraint chk_total_time_neq_0 check (main_time + increment_time != 0),
      constraint fk_white_id foreign key (white_id) references players(id),
      constraint fk_black_id foreign key (black_id) references players(id),
      constraint chk_white_id_neq_black_id check (white_id != black_id)
    );`,
    values: [],
    nestTables: true
  });

  const createPositionsTable = await query({
    sql: `create table positions (
      id int not null primary key auto_increment,
      game_id int not null,
      fen varchar(255) not null,
      move_number int not null check (-1 < move_number),
      next_move varchar(10),
      prev_move varchar(10),
      constraint fk_game_id foreign key (game_id) references games(id)
    );`,
    values: [],
    nestTables: true
  });

  const createIndex = await query({
    sql: `create index fen_index
    on positions (fen);`,
    values: [],
    nestTables: true
  });

};

testProdData();
