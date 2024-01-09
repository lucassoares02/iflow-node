require("dotenv").config();

const { Client } = require("pg");

const connection = new Client({
  user: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOSTNAME,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  ssl: true,
});

// Conectar ao banco de dados
connection
  .connect()
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch((err) => console.error("Erro de conexão:", err));

module.exports = connection;
