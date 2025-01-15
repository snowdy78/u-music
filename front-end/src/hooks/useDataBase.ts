import mysql from 'mysql2'

export function useDataBase() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'u-music-app',
    password: '',
    port: 3306
  })
}
