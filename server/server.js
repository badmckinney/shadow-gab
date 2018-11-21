//loads in libraries
const express = require('express');
const _ = require('lodash');
const path = require('path');
const bodyParser = require('body-parser');

//loads in local imports
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');

const {MongoClient, ObjectID} = require('mongodb');

//connect to db
MongoClient.connect('mongodb://localhost:27017/ShadowGab', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to database server');
  }
  console.log('Connected to database server');
  const db = client.db('ShadowGab');

  client.close();
});

//creates a new express app
const app = express();

//middleware 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*---------------------------
          ROUTES
---------------------------*/

app.post('/users', (req, res) => {
  let user = new User({
    screenname: req.body.screenname,
    password: req.body.password
  });

  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
