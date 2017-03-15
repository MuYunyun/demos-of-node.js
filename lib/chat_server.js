/* 聊天程序需要处理下面这些场景和事件
*  分配昵称
*  房间更换请求
*  昵称更换请求
*  发送聊天消息
*  房间创建
*  用户断开连接
*/
const socketio = require('socket.io')
const nickNames = {}
const namesUsed = [] // 已使用的名字
const currentRoom = {} // 当前房间
let io
let guestNumber = 1

// 启动Socket.IO服务器
exports.listen = (server) => {
  io = socketio.listen(server)
  io.set('log level', 1)

  io.sockets.on('connection', (socket) => {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // 在用户连接上来时赋予其一个访客名(分配昵称)

    joinRoom(socket, 'Lobby') // 在用户连接上来时把他放入聊天室Lobby里

    handleMessageBroadcasting(socket, nickNames) // 处理用户的消息
    handleNameChangeAttempts(socket, nickNames, namesUsed) // 更名
    handleRoomJoining(socket); // 聊天室的创建和变更

    // socket.on('rooms', function() {  // 用户发出请求时，向其提供已经被占用的聊天室的列表
    //   socket.emit('rooms', io.sockets.manager.rooms)
    // })

    handleClientDisconnection(socket, nickNames, namesUsed) // 用户断开连接后的清除逻辑
  })
}

// 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  let name = 'Guest' + guestNumber;
  nickNames[socket.id] = name; // 把用户昵称跟客户端连接ID关联上
  socket.emit('nameResult', { // 让用户知道他们的昵称
    success: true,
    name: name
  })
  namesUsed.push(name)
  return guestNumber + 1
}

// 与进入聊天室相关的逻辑
function joinRoom(socket, room) { // 与进入聊天室相关的逻辑
  socket.join(room) // 让用户进入房间
  currentRoom[socket.id] = room // 记录用户的当前房间
  socket.emit('joinResult', {room: room}) // 让用户知道他们进入了新的房间
  socket.broadcast.to(room).emit('message', { // 让房间里的其他用户知道有新用户进入了房间
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  // let usersInRoom  = io.sockets.clients(room); // 确定有哪些用户在这个房间里
  // if (usersInRoom.length > 1) {
  //   let usersInRoomSummary = 'Users currently in ' + room + ': '
  //   for (let index in usersInRoom) {
  //     let userSocketId = usersInRoom[index].id;
  //     if (userSocketId != socket.id) { // 排除掉自己
  //       if (index > 0) {
  //         usersInRoomSummary += ', '
  //       }
  //       usersInRoomSummary += nickNames[userSocketId]
  //     }
  //   }
  //   usersInRoomSummary += '.'
  //   socket.emit('message', {text: usersInRoomSummary}) //讲房间里其他用户的汇总发送给这个用户
  // }
}

// 更名请求的处理逻辑
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) {
    if (name.indexof('Guest') == 0) {
      socket.emit('nameResult', { // 昵称不能以Guest开头
        success: false,
        message: 'Names cannot begin with "Guest".'
      })
    } else {
      if (namesUsed.indexOf(name) == -1) {
        let previousName = nickNames[socket.id]
        let previousNameIndex = namesUsed.indexOf(previousName)
        namesUsed.push(name)
        nickNames[socket.id] = name
        delete namesUsed[previousNameIndex]
        socket.emit('nameResult', {
          success: true,
          name: name
        })
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        })
      }
    }
  })
}

// 发送聊天消息
function handleMessageBroadcasting(socket) {
  socket.on('message', (message) => {
    console.log(message.room);
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    })
  })
}

// 创建房间
function handleRoomJoining(socket) {
  socket.on('join', function(room){
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

// 用户断开连接
function handleClientDisconnection(socket) {
  socket.on('disconnect', () => {
    let nameIndex = namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}
