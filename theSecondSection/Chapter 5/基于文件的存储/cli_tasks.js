// 收集参数值并解析文件数据库的路径
const fs = require('fs')
const path = require('path')
const args = process.argv.splice(2) // 去掉路径参数
const command = args.shift() // 取出第一个参数
const taskDescription = args.join(' ') // 合并剩余的参数
const file = path.join(process.cwd(), '/.tasks') // 根据当前的工作目录解析数据库的相对路径

switch (command) {
  case 'list':           // 'list'会列出所有已存在的任务
    listTasks(file)
    break

  case 'add':            // 'add'会添加新任务
    addTask(file, taskDescription)
    break

  default:
    console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]')  // 其他认可参数都会显示帮助
}

// 从文本文件中加载用JSON编码的数据
function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function(exists) {  // 检查.tasks文件是否已经存在
    var tasks = []
    if (exists) {
      fs.readFile(file, 'utf8', function(err, data) { // 从.tasks文件中读取代办事项数据
        if (err) throw err
        var data = data.toString()
        var tasks = JSON.parse(data || '[]') // 把用JSON编码的代办事项数据解析到任务数组中
        // console.log(tasks)
        cb(tasks)
      })
    } else {
      cb([]) // 如果.tasks文件不存在，则创建空的任务数组
    }
  })
}

// 列出任务的函数
function listTasks(file) {
  loadOrInitializeTaskArray(file, function(tasks) {
    for(var i in tasks) {
      console.log(tasks[i])
    }
  })
}

// 把任务保存到磁盘中
function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
    if (err) throw err
    console.log('Saved')
  })
}

// 添加一项任务
function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function(tasks) {
    tasks.push(taskDescription)
    storeTasks(file, tasks)
  })
}