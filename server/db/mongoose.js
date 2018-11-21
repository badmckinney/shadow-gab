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
mongoose.connect('mongodb://localhost:27017/ShadowGab', { useNewUrlParser: true });

module.exports = {mongoose};
