//loads in libraries
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const socketIO = require('socket.io');
const http = require('http');
const {MongoClient, ObjectID} = require('mongodb');

//loads in local imports
const {mongoose} = require('./server/db/mongoose');
const {User} = require('./server/models/user');
const authenticate = require('./server/middleware/passport');
const {generateMessage, generateLocationMessage} = require('./server/utils/message');
const {isRealString} = require('./server/utils/validation');
const {Users} = require('./server/utils/users');

//connect to db
MongoClient.connect('mongodb://localhost:27017/ShadowGab', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to database server');
  }
  console.log('Connected to database server');
  const db = client.db('ShadowGab');

  client.close();
});

const port = process.env.PORT || 3000;

//creates a new express app
const app = express();

//middleware config
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret:'secret',
  saveUninitialized: false,
  resave: false
}));

passport.use(new LocalStrategy({
  usernameField: 'screenname',
  passwordField: 'password'
}, (screenname, password, done) => {
  console.log(screenname, password);
  User.findOne({ screenname: screenname }, (err, doc) => {
    if (err) {
      done(err)
    } else if (doc) {
      let valid = bcrypt.compareSync(password, doc.password);

      if (valid) {
        done(null, {
          screenname: doc.screenname,
          password: doc.password
        })
      } else {
        done(null, false)
      }
    }
  })
}));


const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

/*---------------------------
          ROUTES
---------------------------*/

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/signup.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/chat.html'));
});

app.post('/users', (req, res) => {
  console.log(req.body);
  User.findOne({ screenname: req.body.screenname }, (err, doc) => {
    if (err) {
      res.status(500).send('error occured')
    } else if (doc) {
      console.log(doc)
      res.status(500).send('Screenname already taken')
    } else {
      let user = new User({
        screenname: req.body.screenname,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      });

      user.save().then((doc) => {
        res.send(doc);
      }, (e) => {
        res.status(400).send(e);
      });

      res.redirect('/');
    }
  });
});

app.post('/login',passport.authenticate('local', {
  failureRedirect:'/',
  successRedirect:'/chat',
  failureFlash: true
}) , (req, res) => {
  res.send('Success');

  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required');
      }

      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.fetchUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
      callback();
    });
});

/*---------------------------
            CHAT
---------------------------*/
// io.on('connection', (socket) => {
//   console.log('New user connected');
//
//   socket.on('join', (params, callback) => {
//     if (!isRealString(params.name) || !isRealString(params.room)) {
//       return callback('Name and room name are required');
//     }
//
//     socket.join(params.room);
//     users.removeUser(socket.id);
//     users.addUser(socket.id, params.name, params.room);
//
//     io.to(params.room).emit('updateUserList', users.fetchUserList(params.room));
//     socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
//     socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
//     callback();
//   });

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