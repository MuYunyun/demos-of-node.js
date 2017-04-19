// 内存存储
const http = require('http')
let counter = 0

const server = http.createServer(function(req, res) {
  counter++
  res.end('I have been accessed ' + counter + ' times.')
}).listen(3002)
