var connect = require('connect')
var app = connect()
  .use(connect.bodyParser())
  .use(function(req, res) {
    // ..注册用户..
    res.end('Registered new user: ' + req.body.username)
  })