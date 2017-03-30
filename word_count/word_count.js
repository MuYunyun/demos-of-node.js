// 在一个简单的程序中实现并行流程控制
var fs = require('fs')
var completedTasks = 0
var tasks = []
var wordCounts = {}
var filesDir = './text'

function checkIfComplete() {   // 当所有任务全部完成后，列出文件中用到的每个单词以及用了多少次
  completedTasks++
  // console.log(completedTasks)
  console.log(tasks.length)
  if (completedTasks == tasks.length) {
    for(var index in wordCounts) {
      console.log(index + ': ' + wordCounts[index])
    }
  }
}

function countWordsInText(text) {
  var words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort()
  for (var index in words) {     // 对文本中出现的单词计数
    var word = words[index]
    if (word) {
      wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1
    }
  }
}

fs.readdir(filesDir, function(err, files) {    // 得出text目录中的文件列表
  if (err) {
    throw err
  }
  for(var index in files) {
    var task = (function(file) {     // 定义处理每个文件的任务，每个任务中都会调用一个异步读取文件的函数并对文件中使用的单词计数
      return function() {
        fs.readFile(file, function(err, text) {   // 这里注意fs.readFile()是一个异步进程，countWordsInText(),checkIfComplete()方法会在tasks.push()方法后面进行
          if (err) {
            throw err
          }
          countWordsInText(text)
          checkIfComplete()
        })
      }
    })(filesDir + '/' + files[index])
    tasks.push(task)
  }
  for(var task in tasks) {
    tasks[task]()
  }
})
