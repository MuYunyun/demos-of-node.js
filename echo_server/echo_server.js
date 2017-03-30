// 到51页(node.js实战)
//  用on方法响应事件
// var net = require('net')
// var server = net.createServer(function(socket) {
//   socket.on('data', function(data) {  // 当读取到新数据时处理的data事件
//     socket.write(data);  // 数据被写回客户端
//   })
// })


//  用once方法响应单次事件
// var net = require('net')
// var server = net.createServer(function(socket) {
//   socket.once('data', function(data) {  // 当读取到新数据时处理的data事件
//     socket.write(data);  // 数据被写回客户端
//   })
// })
//
// server.listen(8888);


// 创建事件发射器，一个PUB/SUB的例子
// var EventEmitter = require('events').EventEmitter
// var channel = new EventEmitter()  //定义一个channel事件发射器
// channel.on('join', function() {
//   console.log("Welcome")
// })
//
// channel.emit('join')

// 用事件发射器实现的简单的发布/订阅系统
var events = require('events')
var net = require('net')
var channel = new events.EventEmitter();
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) { // 添加join事件的监听器,保存用户的client对象，以便程序可以将数据发给用户
  this.clients[id] = client
  this.subscriptions[id] = function(senderId, message) {
    if (id != senderId) {     // 忽略发出这一广播数据的用户
      this.clients[id].write(message)
    }
  }
  this.on('broadcast', this.subscriptions[id])  // 添加一个专门针对当前用户的broadcast事件监听器
  var welcome = 'Welcome!\n'
              + 'Guests online: ' + this.listeners('broadcast').length  //让连接上来的用户看到当前有几个已连接的聊天用户
  this.clients[id].write(welcome + '\n')
})

channel.on('leave', function(id) {
  channel.removeListener('broadcast', this.subscriptions(id))
  channel.emit('broadcast', id, id + " has left the chat.\n")
})

channel.on('shutdown', function() {  // 停止聊天服务，但不关闭服务器
  channel.emit('broadcast', '', 'Chat has shut down.\n')
  channel.removeAllListeners('broadcast')
})

// channel.on('error', function(err) {
//   console.log('ERROR: ' + err.message)
// })
//
// channel.emit('error', new Error('Something is wrong.'))

channel.setMaxListeners(50) // 增加监听器的数量

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort
  channel.emit('join', id, client)  // 当有用户连接到服务器上来时发出一个join事件，指明用户ID和client对象
  client.on('data', function(data) {
    data = data.toString()
    channel.emit('broadcast', id, data) // 当有用户发送数据时，发出一个频道broadcast事件，指明用户ID和消息
  })
  client.on('close', function() { // 在用户断开连接时发出leave事件
    channel.emit('leave', id)
  })
  client.on('data', function(data) {
    data = data.toString()
    if (data == "shutdown\r\n") {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })
})

server.listen(8888)
