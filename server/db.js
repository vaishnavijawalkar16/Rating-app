import mysql from "mysql2";

const db = mysql.createConnection({
  host:process.env.DB_HOST || "127.0.0.1",
  user:process.env.DB_USER || "root",
  password:process.env.DB_PASSWORD || "vishclara@16",
  database:process.env.DB_NAME || "ratings_app",
});

export default db;
