const expect = require('expect');
const { Users } = require('../server/utils/users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Bug',
      room: 'Den'
    }, {
      id: '2',
      name: 'Fish',
      room: 'Sea'
    }, {
      id: '3',
      name: 'Bird',
      room: 'Sea'
    }]
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Bad',
      room: 'Leet'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '50';
    var user = users.removeUser(userId);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var user = users.fetchUser('1');

    expect(user.id).toBe('1');
  });

  it('should not find user', () => {
    var user = users.fetchUser('50');

    expect(user).toBe(undefined);
  });

  it('should return names for sea', () => {
    var userList = users.fetchUserList('Sea');
    expect(userList).toEqual(['Fish', 'Bird']);
  });

  it('should return names for den', () => {
    var userList = users.fetchUserList('Den');
    expect(userList).toEqual(['Bug']);
  });
});
