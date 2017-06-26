// 测试 curl --user tobi:ferret http://localhost:3000/admin/users
var connect = require('connect')
var router = require('./middleware/router')

var routes = {
  GET: {
    '/users': function(req, res) {
      res.end('tobi, loki, ferret')
    },
    '/user/:id': function(req, res, id) {
      res.end('user ' + id)
    }
  },
  DELETE: {
    '/user/:id': function(req, res, id) {
      res.end('deleted user ' + id)
    }
  }
}

function logger(req, res, next) {
  console.log(req.method, req.url)
  next()
}

function setup(format) {
  var regexp = /:(\w+)/g
  return function logger(req, res, next) {
    var str = format.replace(regexp, function(match, property) {
      console.log('3333' + property)
      return req[property]
    })
    console.log(str)
    next()
  }
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization  // 这里是一个base64字符
  // console.log('11111' + authorization)
  if (!authorization) return next(new Error('Unauthorized'))

  var parts = authorization.split(' ')
  var scheme = parts[0]
  var auth = new Buffer(parts[1], 'base64').toString().split(':')
  // console.log('222', auth)
  var user = auth[0]
  var pass = auth[1]

  // authenticateWithDatabase(user, pass, function(err) {
  //   if (err) return next(err)
  //   next()
  // })
}

function admin(req, res, next) {
  switch (req,url) {
    case '/':
      res.end('try /users')
      break
    case '/users':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['tobi', 'loki', 'jane']))
      break
  }
}

var app = connect()
// app.use(logger)
// app.use('/admin', restrict)
// app.use('/admin', admin)
// app.use(hello)
app.use(router(routes))
app.listen(3000)
