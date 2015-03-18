
/*
 * GET home page.
 */

var formidable = require('formidable');
var fs = require('fs');
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.save = function(req, res){
  var image = req.files.todo;
  image_upload_path_old = image.path;
  image_upload_path_new = './upload/';
  image_upload_name = image.name;
  image_upload_path_name = image_upload_path_new + image_upload_name;
  
}
