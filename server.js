const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password', //TODO add your password here
  database : 'battleboats'
});

// Connect
db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySql Connected...');
});

// RUN THIS THE FIRST TIME LOCALLY
// let sql = 'CREATE TABLE Users(id int NOT NULL, username VARCHAR(25), password VARCHAR(100), PRIMARY KEY(id));';
// db.query(sql, (err, result) => {
//   if(err) throw err;
//   console.log(result);
//   console.log('Users table created...');
// });


// basic api for backend

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.post('/api/auth', async (req, res) => {
  // req.body contains stuff
  const {username} = req.body;
  const {password} = req.body;
  // why is pw undefined
  console.log("PW: "+password);
  // check in db
  const hash = await bcrypt.hash(password, 10);
  console.log("hash from client: "+hash);


  const responseObject = {};
  // header error since async
  let sql = 'SELECT * FROM Users WHERE username=\''+ username + '\' '; //DB query to check if credentials match

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);

    if (result.length <= 0) {
      console.log("No user match");
      responseObject.signedIn = false;
      res.json(responseObject);
    } else {
      // check pw
      console.log("hash from db: "+result[0].password);
      bcrypt.compare(password, result[0].password, (err, same) => {
        if (same) {
          // how to make sure this data gets updated before res.json?
          console.log("User match");
          responseObject.signedIn = true;
          responseObject.username = username;
          res.json(responseObject);
        } else {
          console.log("found user, wrong password");
          responseObject.signedIn = false;
          res.json(responseObject);
        }
      });
    }
  });
  // return bad if hash not in db, 200 if ok

  // console.log(JSON.stringify(responseObject, null, 2))
  // might send if query not done
  // res.json(responseObject);
});

app.post('/api/createUser', async (req, res) => {
  // assume req has
  const {username} = req.body;
  const {password} = req.body;
  const id = Math.floor(Math.random() * Math.floor(10000))

  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
  // let sql = 'INSERT INTO Users(id, username, password) VALUES(id, username, password);';
  let dbObj = {
    id: id,
    username: username,
    password: hash
  }
  let sql = 'INSERT INTO Users SET ?';
  let query = db.query(sql, dbObj, (err, result) => {
    if (err) throw err;
    console.log(result);
  });


  // db.query(sql, (err, result) => {
  //   if (err) throw err;
  //   console.log(result);
  // });

  res.json({signedIn: true});
});

app.listen(port, () => console.log(`Listening on port ${port}`));