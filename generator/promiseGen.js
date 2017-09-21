var fs = require('fs')

var readFile = function(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error)
      resolve(data)
    })
  })
}

function* generator() {
  var file1 = yield readFile('./file1.txt')
  var file2 = yield readFile('./file2.txt')

  console.log(file1.toString())
  console.log(file2.toString())
}

function co(generator) {
  var gen = generator()

  function next(data) {
    var result = gen.next(data)
    if (result.done) return result.value
    result.value.then(function(data) {
      next(data)
    })
  }
  next()
}

co(generator)