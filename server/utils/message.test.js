const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'bulbasaur';
    var text = 'bulbasaur!';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = "user";
    var latitude = 21.378544899999998;
    var longitude = -157.9307622;
    var url = 'https://www.google.com/maps?q=21.378544899999998,-157.9307622';
    var message = generateLocationMessage(from, latitude, longitude);
      expect(message).toInclude({from, url});
      expect(message.createdAt).toBeA('number');
  });
});
