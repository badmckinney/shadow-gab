// addUser(id, name, room)
// removeUser(id)
// fetchUser(name, room)
// getUserList(room)

// "Users" class for persisting user data
class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.fetchUser(id)

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  fetchUser (id) {
     return this.users.filter((user) => user.id === id)[0];
  }
  fetchUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};
