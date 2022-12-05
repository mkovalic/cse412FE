//Connection to postgresql.
//run this file using node to start api server.
//i.e -- node dbcon.js
const {Client} = require('pg') //postgre

const client = new Client({
	host: "localhost",
	user: "harrisonglenn",
	port: "8898",
	database: "harrisonglenn"
})

const port = 3000
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


client.connect();

//get data from postgres
app.get('/airline', (req, res)=>{
    client.query(`Select * from airline`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/airport', (req, res)=>{
    client.query(`Select * from airport`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/city', (req, res)=>{
    const query = `SELECT *
    FROM city c
    WHERE EXISTS (
      SELECT 1
      FROM airport a
      WHERE a.city_code = c.code
    );
    `
    client.query(query, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/country', (req, res)=>{
    client.query(`Select * from country`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/matchedairports', (req, res)=>{
    client.query(`Select * from matchedairports`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})
