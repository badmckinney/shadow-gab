const expect = require('expect');
const { isRealString } = require('../server/utils/validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var str = 123;
    var valid = isRealString(str);
    expect(valid).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var str = "    ";
    var valid = isRealString(str);
    expect(valid).toBe(false);
  });

  it('should allow string non-space characters', () => {
    var str = "Room";
    var valid = isRealString(str);
    expect(valid).toBe(true);
  });
});
