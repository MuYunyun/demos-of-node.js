// 在一个简单的程序中实现串行化流程控制
var fs = require('fs')
var request = require('request') // 用它获取RSS数据
var htmlparser = require('htmlparser') // 把原始的RSS数据转换成JavaScript结构
var configFilename = './rss_feeds.txt'

function checkForRSSFile() { // 任务1：确保包含RSS预定源URL列表的文件存在
  fs.exists(configFilename, function(exists) {
    if (!exists) {
      return next(new Error('Missing RSS file: ' + configFilename)) // 只要有错误就尽早返回
    }
    next(null, configFilename)
  })
}

function readRSSFile (configFilename) { // 任务2：读取并解析包含预定源URL的文件
  fs.readFile(configFilename, function(err, feedList) {
    if (err) {
      return next(err)
    }

    feedList = feedList                          // 讲预定源URL列表转换成字符串，然后分隔成一个数组
                 .toString()
                 .replace(/^\s+|\s+$/g, '')
                 .split("\n");
    var random = Math.floor(Math.random()*feedList.length)  // 从预定源URL数组中随机选择一个预定源URL
    next(null, feedList[random])
  })
}
// console.log('进入')

function downloadRSSFeed(feedUrl) {  // 任务3：向选定的预定源发送HTTP请求以获取数据
  request({uri: feedUrl}, function(err, res, body) {
    if (err) {
      return next(err)
    }
    if (res.statusCode != 200) {
      return next(new Error('Abnormal response status code'))
    }

    next(null, body)
  })
}

function parseRSSFeed(rss) {  // 任务4：将预定源数据解析到一个条目数组中
  var handler = new htmlparser.RssHandler()
  var parser = new htmlparser.Parser(handler)
  parser.parseComplete(rss)
  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found'))
  }
  console.log(handler.dom.items)
  var item = handler.dom.items.shift()
  console.log(item.title)
  console.log(item.link)
}
var tasks = [ checkForRSSFile,      // 把所有要做的任务按执行顺序添加到一个数组中
              readRSSFile,
              downloadRSSFeed,
              parseRSSFeed ]

function next(err, result) {
  if (err) {
    throw err
  }

  var currentTask = tasks.shift()   // 从任务数组中取出下个任务

  if (currentTask) {
    currentTask(result)   // 执行当前任务
  }
}

next()  // 开始任务的串行化执行
