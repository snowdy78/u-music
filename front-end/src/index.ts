import mysql from 'mysql2'
import express from 'express'
import cors from 'cors'

const app = express()

export function useDataBase() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'u_music_app',
    password: '',
  })
}
app.listen(8800, () => {
  console.log("connected works")
});

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
  res.send("hi");
})
app.get('/instruments', (req, res) => {
  const q = "SELECT * FROM instruments";
  useDataBase().query(q, (err, data) => {
    if (err)
      return res.json(err);
    return res.json(data)
  });
})
const connection = useDataBase();

connection.connect(err => {
  console.log(err ? 'not connected' : 'connected')
});
