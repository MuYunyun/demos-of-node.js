var fs = require('fs')

function readFile(filename) {
  return function(callback) {
    fs.readFile(filename, 'utf8', callback)
  }
}

co(function* () {
  var file1 = yield readFile('./file1.txt')
  var file2 = yield readFile('./file2.txt')

  console.log(file1) // I'm file1
  console.log(file2) // I'm file2
  return 'done'
})(function(err, result) {
  console.log(result)
})

function co(generator) {
  return function(fn) {
    var gen = generator()
    function next(err, result) {
      if(err) {
        return fn(err)
      }
      var step = gen.next(result)
      if (!step.done) {
        step.value(next)
      } else {
        fn(null, step.value)
      }
    }
    next()
  }
}