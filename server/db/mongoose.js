// // loads in mongoose library
// const mongoose = require('mongoose');
//
// // configures mongoose to use Promises and connects to database based on environment
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI);
//
// module.exports = {
//   mongoose
// }
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dbURI = 'mongodb://admin:password1@ds217864.mlab.com:17864/shadow-gab';
mongoose.connect(dbURI, { useNewUrlParser: true });

// When successfully connected
mongoose.connection.on('connected', function () {  
    console.log('Mongoose connection open to ' + dbURI);
  }); 
  
  // If the connection throws an error
  mongoose.connection.on('error',function (err) {  
    console.log('Mongoose connection error: ' + err);
  }); 
  
  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose connection disconnected'); 
  });
  
  // If the Node process ends, close the Mongoose connection 
  process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log('Mongoose connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  }); 

module.exports = {mongoose};

// mongodb://admin:password1@ds217864.mlab.com:17864/shadow-gab
//mongodb://localhost:27017/ShadowGab