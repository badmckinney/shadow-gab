var socket = io();

//function to enable auto scroll based on a small threshold at the bottom of chat window
function scrollToBottom () {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.height();
  var lastMessageHeight = newMessage.prev().height();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight + 50 >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {

  socket.emit('join', null, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//  listens for server to emit updateUserList event, then updates the UI user list by looping over
//  all users and appending a list item for each. 
socket.on('updateUserList', function (users) {
  var ul = $('<ul></ul>');

  users.forEach(function (user) {
    ul.append($('<li></li>').text(user));
  });

  $('#users').html(ul);
});

// appends new messages to chat window when server emits newMessage event
socket.on('newMessage', function (message) {
  //utilizes moment.js to create formatted timestamps for each message
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // uses moustache.js template (found in chat.html) to render messages
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  $('#messages').append(html);
  scrollToBottom();
});

// emits createMessage event and sends over user input from message text input
$('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')
  });
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});
