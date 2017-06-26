var express = require('express');
var router = express.Router();

var Photo = require('../models/Photo')
var path = require('path')
var fs = require('fs')
var join = path.join

// var photos = []
// photos.push({
//   name: 'Node.js Logo',
//   path: 'http://nodejs.org/images/logos/nodejs-green.png',
// }, {
//   name: 'Ryan Speaking',
//   path: 'http://nodejs.org/images/ryan-speaker.jpg',
// })

/* GET users listing. */
router.get('/', function(req, res, next) {
  Photo.find({}, function(err, photos) {
    if (err) return next(err)
    res.render('index', {
      title: 'Photos',
      photos: photos,
    })
  })
});

router.get('/upload', function(req, res, next) {
  res.render('upload', {
    title: 'Photos upload',
  })
});


router.post('/upload', function(req, res, next) {
  var name = req.body.photo.name || img.name
  var img = req.files.photo.image
  var path = join(dir, img.name)

  fs.rename(img.path, path, function(err) {
    if (err) return next(err)

    Photo.create({
      name: name,
      path: img.name
    }, function(err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
})

module.exports = router;