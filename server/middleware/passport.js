const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../db/mongoose');

passport.serializeUser(() => {
  done(null, user);
});

passport.deserializeUser(() => {
  done(null, user);
});

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
