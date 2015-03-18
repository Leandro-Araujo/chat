
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var sala = require('./routes/sala');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var fs = require('fs');
var formidable = require('formidable');
var app = express();

const KEY = 'ntalk.sid', SECRET = 'ntalk';
cookie = express.cookieParser(SECRET);
store = new express.session.MemoryStore();

var server = http.createServer(app);
io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(cookie);
app.use(express.session({secret: SECRET, key: KEY, store: store}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', user.list);
app.post('/', user.userPost);
//app.get('/users', user.list);
//app.post('/users', user.userPost);
app.get('/logout', user.logout);
app.get('/sala', sala.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

nicknames = [];

io.set('authorization', function(data, accept) {
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[KEY];
    store.get(sessionID, function(err, session) {
      console.log(session);
      if (err || !session || !session.login) {
        console.log("oi");
        accept(null, false);
      } else {
        data.session = session;
        accept(null, true);
      }

    });
  });
});

io.sockets.on('connection', function(socket){

  console.log(socket.handshake);


  //console.log(socket.request);
  socket.send(JSON.stringify({
    type:'serverMessage',
    message: 'Welcome to the most interesting chat room on earth!'
    }));

  socket.on('message', function(message){
    message= JSON.parse(message);
    if(message.type == "userMessage"){
      socket.broadcast.send(JSON.stringify(message));
      message.type = "myMessage";
      socket.send(JSON.stringify(message));
    }
  });

  socket.on('send message', function(data){
    io.sockets.emit('new message', {'mensagem': data.mensagem, 'nick': socket.nickname});
  });

  socket.on('new user', function(dados){
    console.log(dados);
    socket.nickname = dados;
    nicknames.push(socket.nickname);
    console.log(nicknames);
  });

  //socket.on()

  socket.on('disconnect', function(data){
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    console.log(nicknames);
  });



});
