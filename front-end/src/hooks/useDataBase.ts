import mysql from 'mysql2';
import express from 'express';

const app = express();

export function useDataBase() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'u_music_app',
    password: '',
  })
}
app.listen(80, () => {
  console.log("connected works")
});
const connection = useDataBase();

connection.connect(err => {
  console.log(err ? 'not connected' : 'connected')
});