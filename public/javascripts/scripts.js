
$(document).ready(function(){

  var socket = io.connect('http://localhost:3000/');
  var $messageForm = $('#conversa');
  var $nick = $('#nick');
  var $nick2 = $('#nick2');
  var $chat = $('.chat');
  var $nickname = $('#nickname');

  //socket.on('connect', function (socket){
    //alert("oi");
    //socket.emit('new user', {"oi":"oi"});
  //});

  $('#send').click(function(){

    //socket.on('connect', function(socket){
    //  alert(socket.sessionid);
    //});

    socket.emit('new user', {'user': $nick2.val()});
    //socket.emit("set_name", {name: $nickname.val()});
    return false;
  });

  $('#save').click(function(){

    socket.emit('send message', {'mensagem': $messageForm.val(), 'nick': $nick.val()});
      return false;
    });

  socket.on('new message', function(data){
    $chat.append("<span class=\"label label-success\">"+data.nick.user+"</span>"+
    "<div class=\"well well-sm\">"+
    data.mensagem+
    "</div>");
  });


});
