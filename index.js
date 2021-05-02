const express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
const port = 3000

const { Client } = require('pg')
const connectionString =  process.env.DATABASE_URL //'postgresql://postgres:postgres@localhost:5432/postgres'
const client = new Client({
  connectionString,
})
client.connect()

app.use(cors())

app.use(bodyParser.json());

app.get('/comics', async (req, res, next) => {

  let comics = await client.query('SELECT * FROM comics', [])

  res.send(comics)
})


app.get('/characters_db', async (req, res, next) => {

  let characters_db = await client.query('SELECT * FROM characters_db', [])

  res.send(characters_db)
})
app.delete('/comics/:id', async (req, res, next) => {
  console.log(req.params.id)
  try {
    let comics = await client.query(`DELETE FROM comics WHERE "Title"= $1`, [req.params.id])
  } catch (err) {
    console.log(err)
    res.send("DELETE Request failed")
  }
  res.send("DELETE Request Called")
})

app.put('/comics/:id', async (req, res, next) => {
  let newcomic = await client.query('UPDATE comics SET "Status" =$2 WHERE "Title"=$1', [req.params.id,req.body.status])

  res.send("UPDATE Request Called")
})




app.get('/comics/:id', async (req, res, next) => {
  console.log(req.params.id)
  let comics = await client.query('SELECT * FROM comics WHERE "Title"=$1', [req.params.id])

  res.send(comics)
})
app.post('/comics', async (req, res, next) => {
  try {
    let comics = await client.query('insert into comics("Title","Genre","Status","Author") values ($1,$2,$3,$4)', [req.body.Title, req.body.Genre, req.body.Status, req.body.Author])
    res.send('Successfully created comics')
  } catch (err) {
    console.log(err)
    res.send("Failed to create comics")
  }
})
const characters = [{ name: 'temmie' }, { name: 'yachi' }, { name: 'sans' }]
app.get('/characters', (req, res, next) => {
  res.send(characters)
})

app.get('/', (req, res) => {
  res.send('Hello world')
})

//app.listen(port, () => {
//console.log(`Example app listening at http://localhost:${port}`)})
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log(`Example app listening at http://localhost:${port}`);
});