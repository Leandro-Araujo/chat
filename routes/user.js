
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('usuario');
};

exports.userPost = function(req, res){
  //console.log(req.body);
  req.session.login = req.body.login;
  req.session.password = req.body.password;
  req.session.save();
  console.log(req.session);
  res.redirect('/sala');
}

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect("/");
}
