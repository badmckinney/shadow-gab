const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connects to hosted database using mongoose
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true });

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = { mongoose };

