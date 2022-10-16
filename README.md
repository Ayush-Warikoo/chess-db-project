# CS348-project

CS348-project

## Getting Started

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

### Loading sample data (WIP)
1. Run `npm run load-sample-data`

## Troubleshooting

### `'.' is not recognized as an internal or external command, operable program or batch file.`

- https://stackoverflow.com/a/52954967

### `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

- https://stackoverflow.com/a/50131831
