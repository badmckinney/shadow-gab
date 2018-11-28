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
mongoose.connect('mongodb://admin:password1@ds217864.mlab.com:17864/shadow-gab', { useNewUrlParser: true }, (err) => {
    if (err) throw err;
});

module.exports = {mongoose};

// mongodb://admin:password1@ds217864.mlab.com:17864/shadow-gab
//mongodb://localhost:27017/ShadowGab