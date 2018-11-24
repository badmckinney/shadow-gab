const express = require('express');
const router = express.Router();
const {User} = require('../db/mongoose');

module.exports = (passport) => {
  router.post('/signup', (req, res) => {
    let body = req.body,
      username = body.username,
      password = body.password;
    User.findOne({ username:username }, (err, doc) => {
      if(err) {
        res.status(500).send('error occured')
      } else if (doc) {
        res.status(500).send('Screenname already taken')
      } else {
        let user = new User()
        user.username = username;
        user.password = user.hashPassword(password);
        user.save((err, user) => {
          if (err) {
            res.status(500).send('db error');
          } else {
            res.send(user);
          }
        })
      }
    })
  });
  return router;
}
