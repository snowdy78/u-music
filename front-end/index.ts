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
function getDataBaseData(query: string, response: any) {
  useDataBase().query(query, (err, data) => {
    if (err)
      return response.json(err)
    return response.json(data)
  });
}
function postDataBaseData(query: string, values: any, response: any) {
  useDataBase().query(query, [values], (err, data) => {
    if (err)
      return response.json(err)
    return response.json(data)
  });
}

app.listen(8800, () => {
  console.log("connected works")
});

app.use(express.json())
app.use(cors());

app.get('/', (_, res) => {
  res.send("hi");
})
app.get('/instruments', (_, res) => {
  const q = "SELECT * FROM instruments";
  useDataBase().query(q, (err, data) => {
    if (err)
      return res.json(err);
    return res.json(data)
  });
})
app.get('/users', (_, res) => {
  getDataBaseData("SELECT * FROM users", res);
})
app.post('/users', (req, res) => {
  postDataBaseData(
    "INSERT INTO users (`login`, `email`, `password`) VALUES (?)", 
    [
      req.body.login,
      req.body.email,
      req.body.password,
    ], 
    res
  )
})
app.post('/instruments', (req, res) => {
  postDataBaseData(
    "INSERT INTO instruments (`model_name`, `category`, `price`, `in_stock`) VALUES (?)", 
    [
      req.body.model_name,
      req.body.category,
      req.body.price,
      req.body.in_stock,
    ], 
    res
  );
})
const connection = useDataBase();

connection.connect(err => {
  console.log(err ? 'not connected' : 'connected')
});
