// 一个完整的RESTful服务
var http = require('http')
var url = require('url')
var items = []

var server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'POST':
      var item = ''
      req.setEncoding('utf8')
      req.on('data', function(chunk) {
        item += chunk
      })
      req.on('end', function() {
        items.push(item)
        res.end(item)
      })
      break
    case 'GET':
      var body = items.map(function(item, i){
        return i + ') ' + item
      }).join('\n')
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.end(body)
      break
    case 'DELETE':  // pathname: '/1'
      var path = url.parse(req.url).pathname // 解析出pathname
      var i = parseInt(path.slice(1), 10)

      if (isNaN(i)) { // 检查数字是否有效
        res.statusCode = 400
        res.end('Invalid item id')
      } else if(!item[i]) { // 确保请求的索引存在
        res.statusCode = 404
        res.end('Item not found')
      } else {
        items.splice(i, 1)
        res.end('OK\n')
      }
      break
    case 'PUT':

      break
  }
})
server.listen(3002)
