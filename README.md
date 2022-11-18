# CS348-project
# Getting Started
## Creating and Loading the Sample Database

### Installing MySQL locally

1. Download the MySQL installer ([link for Windows 10](https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.31.0.msi))
2. Install with all default options

### Creating the database

1. Open MySQL Workbench
2. Run `create database chessdb;`
3. Run `use chessdb;`

### Configuring environment variables (dev environment)

1. Create a file called `dev.env` in the `backend/config` folder
2. Paste the contents `backend/config/sample.txt` into `dev.env`
3. Replace `<replace_with_your_password>` with the password set during your MySQL installation

### Running database migrations

1. To upgrade to the latest version of the database, run `npm run db-migrate up`
2. To downgrade to the previous version of the database, run `npm run db-migrate down`

### Loading sample data and run sql files (test-sample.sql)

1. Run `npm run load-sample-data`
2. Compare the output to test-sample.out

### Loading production data and running tests (test-production.sql)

1. Download a sizeable pgn collection from https://www.ficsgames.org/download.html, for proper data use spanning months or years.
2. Drag the files in the Add Game UI on the front end and submit the files.
3. Run `npm run test-prod-data`
4. Look at the output and it should be similar to test-sample.out except have the production values

### Installing Stock Fish Engine

1. Download the appropriate executable for the Stock Fish Engine based on your computer architecture ([link for download](https://stockfishchess.org/download/))
2. Locate the path of the executable/application file from the download
3. Add this file path to the STOCK_FISH_ENG_PATH variable in the dev.env or .env file

## Running the Application Locally

1. Run the backend
    - Navigate to the `/backend` folder
    - Install dependencies by running `npm install`
    - Run `npm run dev`
2. Run the frontend
    - Navigate to the `/frontend` folder
    - Install dependencies by running `npm install`
    - Run `npm start`
3. Navigate to `http://localhost:3000/` to view the web application



## Features

- Play a game on a chessboard, with the ability to undo moves, reset or flip the board
- Get a list of all games that have reached a particular position by moving pieces on a chessboard
- Get percentage of games that have ended in a draw, win, or loss from that position
- Add games to the dataset by uploading a PGN file
- Delete games from the dataset via the Data Table page
- View and update player profiles via the Data Table page
- Get a list of all games that meet a set of criteria (white player name, black player name, minimum elo, result, etc.)
- Get the engine evaluation and stockfish 15 recommended moves for a given position

## Troubleshooting

### `'.' is not recognized as an internal or external command, operable program or batch file.`

- <https://stackoverflow.com/a/52954967>

### `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

- <https://stackoverflow.com/a/50131831>
