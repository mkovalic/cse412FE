//Connection to postgresql.
//run this file using node to start api server.
//i.e -- node dbcon.js
const {Client} = require('pg') //postgre

const client = new Client({
	host: "localhost",
	user: "michael",
	port: "8888",
	database: "michael"
})

const port = 3000
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


/*app.get('/', (req, res) => {
  res.json('urmom!')
})*/



client.connect();

//get data from postgres
app.get('/region', (req, res)=>{
    client.query(`Select * from region`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

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
    client.query(`Select * from city`, (err, result)=>{
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



