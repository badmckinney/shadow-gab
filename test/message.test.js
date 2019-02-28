const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('../server/utils/message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'bulbasaur';
    var text = 'bulbasaur!';
    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = "user";
    var latitude = 21.378544899999998;
    var longitude = -157.9307622;
    var url = 'https://www.google.com/maps?q=21.378544899999998,-157.9307622';
    var message = generateLocationMessage(from, latitude, longitude);
    expect(typeof message.createdAt).toBe('number');
  });
});
