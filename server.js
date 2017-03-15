const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const cache = {}
const chatServer = require('./lib/chat_server'); // 处理基于Socket.IO的服务端聊天功能的

// 请求文件不存在时，发送404错误
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('Error 404: resource not found.')
  response.end()
}

// 提供文件数据服务
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200, {'content-type': mime.lookup(path.basename(filePath))}
  )
  response.end(fileContents)
}

// 提供静态文件服务
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath])
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response)
          } else {
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response)
      }
    })
  }
}

// 创建HTTP服务器
const server = http.createServer(function(request, response) {
  let filePath = false
  if (request.url == '/') {
    filePath = 'public/index.html'
  } else {
    filePath = 'public' + request.url
  }
  let absPath = './' + filePath
  serveStatic(response, cache, absPath)
})

server.listen(3001, function() {
  console.log('Server listening on port 3001.')
})

chatServer.listen(server);
