//loads in libraries
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const socketIO = require('socket.io')({
  transports: [                    
    'websocket'
]
});
const http = require('http');
const {MongoClient} = require('mongodb');

//loads in local imports
const {mongoose} = require('./server/db/mongoose');
const {User} = require('./server/models/user');
const {generateMessage, generateLocationMessage} = require('./server/utils/message');
const {isRealString} = require('./server/utils/validation');
const {Users} = require('./server/utils/users');

const port = process.env.PORT || 3000;

//creates a new express app
const app = express();

//middleware config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret:'OJ did it',
  saveUninitialized: true,
  resave: true
}));

const server = http.createServer(app);
const io = socketIO.listen(server);
const users = new Users();


/*---------------------------
          ROUTES
---------------------------*/

app.get('/', (req, res) => {
  if (req.session.screenname) {
    console.log(req.session);
    res.redirect('/chat');
  } else {
    console.log(req.session);
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});

//Moved this middleware after GET '/' request to give my request higher priority
app.use(express.static(__dirname + '/public'));

app.get('/signup', (req, res) => {
  if (req.session.screenname) {
    console.log(req.session);
    res.redirect('/chat');
  } else {
    console.log(req.session);
    res.sendFile(path.join(__dirname + '/public/signup.html'));
  }
});

app.get('/chat', (req, res) => {
  if (!req.session.screenname) {
    console.log(req.session);
    res.redirect('/');
  }

  res.sendFile(path.join(__dirname + '/public/chat.html'));
});

app.get('/logout', (req, res) => {
  req.session.screenname = "";

  res.redirect('/');
});

app.post('/users', (req, res) => {
  console.log(req.body);
  User.findOne({ screenname: req.body.screenname }, (err, doc) => {
    if (err) {
      res.status(500).send('error occured');
    } else if (doc) {
      console.log(doc)
      res.status(500).send('Screenname already taken');
    } else {
      let user = new User({
        screenname: req.body.screenname,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      });

      user.save().then(() => {
        res.redirect('/');
      }, (e) => {
        res.status(400).send(e);
      });
    }
  });
});

app.post('/chat', (req, res) => {
    console.log(req.body);

    User.findOne({ screenname: req.body.screenname }, (err,doc) => {
      if (err) {
        res.status(500).send('error occured');
      } else if (!doc) {
        res.status(500).send('Account doesn\'t exist. Please sign up.');
      } else if (doc) {
        console.log(doc);
        let valid = bcrypt.compareSync(req.body.password, doc.password);

        if (!valid) {
          res.status(500).send('Incorrect Password');
        } else if (valid) {
          if (!req.session.screenname) {
            res.sendFile(path.join(__dirname + '/public/chat.html'));
            io.on('connection', (socket) => {
              console.log('New user connected');

              socket.on('join', (params, callback) => {
                if (!isRealString(req.body.screenname) || !isRealString(req.body.room)) {
                  return callback('Name and room name are required');
                }

                socket.join(req.body.room);
                users.removeUser(socket.id);
                users.addUser(socket.id, req.body.screenname, req.body.room);

                io.to(req.body.room).emit('updateUserList', users.fetchUserList(req.body.room));
                console.log(req.session.screenname);
                if (!req.session.screenname) {
                  socket.emit('newMessage', generateMessage('Admin', `Welcome to ${req.body.room} room`));
                  socket.broadcast.to(req.body.room).emit('newMessage', generateMessage('Admin', `${req.body.screenname} has joined`));
                }
                req.session.screenname = req.body.screenname;
                console.log(req.session.screenname);  
                callback();

              });
            });
          }
        }
      }
    });
});

/*---------------------------
            CHAT
---------------------------*/
io.on('connection', (socket) => {

  socket.on('createMessage', (message, callback) => {
    var user = users.fetchUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.fetchUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.fetchUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server up on port ${port}`)
});
