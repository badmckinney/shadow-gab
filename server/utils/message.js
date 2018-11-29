const moment = require('moment');

// reusable function for generating a message object
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
};

// reusable function for generating a location message object
var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
