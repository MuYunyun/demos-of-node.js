function divEscapedContentElement(message) { // 用来显示可疑的文本
  return $('<div></div>').text(message)
}

function divSystemContentElement(message) { // 用来显示可信的文本
  return $('<div></div>').html('<i>' + message + '</i>')
}

// 处理原始的用户输入
function processUserInput(chatApp, socket) {
  let message = $('#send-message').val()
  let systemMessage
  if (message.charAt(0) == '/') {  // 作为聊天命令
    systemMessage = chatApp.processCommand(message)
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage))
    }
  } else {  // 将非命令输入广播给其他用户
    chatApp.sendMessage($('#room').text(), message)
    $('#messages').append(divEscapedContentElement(message))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
  }

  $('#send-message').val('')
}

// 客户端程序初始化逻辑
let socket = io.connect()

$(document).ready(function() {
  const chatApp = new Chat(socket)

  socket.on('nameResult', (result) => {  // 显示更名尝试的结果
    let message

    if (result.success) {
      message = 'You are now known as ' + result.name + '.'
    } else {
      message = result.message
    }
    $('#messages').append(divSystemContentElement(message))
  })

  socket.on('joinResult', (result) => {  // 显示房间变更结果
    $('#room').text(result.room)
    $('#messages').append(divSystemContentElement('Room changed.'))
  })

  socket.on('message', (message) => {  // 显示接收到的消息
    let newElement = $('<div></div>').text(message.text)
    $('#messages').append(newElement)
  })

  socket.on('rooms', (rooms) => {  // 可用房间列表
    $('#room-list').empty()
    for(let room in rooms) {
      // room = room.substring(1, room.length)
      if(room != '') {
        $('#room-list').append(divEscapedContentElement(room))
      }
    }

    $('#room-list div').click(function() { // 点击房间可以换到那个房间中
      chatApp.processCommand('/join ' + $(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(function() { // 定期请求可用房间列表
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus();

  $('#send-form').submit(function() {
    processUserInput(chatApp, socket)
    return false
  })
})
