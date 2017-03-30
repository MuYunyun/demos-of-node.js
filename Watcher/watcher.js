// 51~52
// 扩展事件监听器：文件监视器
function Watcher(watchDir, processedDir) {  // 要监控的目录和放置修改过的文件的目录
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

var events = require('events')
var util = require('util');

util.inherits(Watcher, events.EventEmitter)

// 扩展事件发射器的功能
var fs = require('fs'),
    watchDir = './watch',
    processedDir = './done';

Watcher.prototype.watch = function() {  // 扩展EventEmitter添加处理文件的方法
  console.log('2')
  var watcher = this
  fs.readdir(this.watchDir, function(err, files) {
    if (err) {
      throw err
    }
    for(var index in files) {
      watcher.emit('process', files[index])
    }
  })
}

Watcher.prototype.start = function() {
  var watcher = this
  fs.watchFile(watchDir, function() {
    watcher.watch()
  })
}

var watcher = new Watcher(watchDir, processedDir)

watcher.on('process', function process(file) {
  var watchFile = this.watchDir + '/' + file
  var processedFile = this.processedDir + '/' + file.toLowerCase()

  fs.rename(watchFile, processedFile, function(err) {
    if(err) {
      throw err
    }
  })
})

watcher.start()
