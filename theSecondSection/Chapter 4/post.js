// formidable  https://github.com/felixge/node-formidable
var http = require('http')
var formidable = require('formidable')

function show(res) {
  var html = `<form method="post" action="/" enctype="multipart/form-data">
  <p><input type="text" name="name" /></p>
  <p><input type="file" name="file" /></p>
  <p><input type="submit" value="Upload" /></p>
  </form>`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res) { // 上传逻辑
  show(res)
  if (!isFormData(req)) {
    res.statusCode = 400
    res.end('Bad Request:expecting multipart/form-data')
    return
  }

  var form = new formidable.IncomingForm()

  // form.on('field', function(field, value) {
  //   console.log(field)
  //   console.log(value)
  // })
  //
  // form.on('file', function(name, file) {
  //   console.log(name)
  //   console.log(file)
  // })
  //
  // form.on('end', function() {
  //   res.end('upload complete!')
  // })

  form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = Math.floor(bytesReceived / bytesExpected * 100)
    console.log(percent)
  })

  form.parse(req, function(err, fields, files) {
    console.log(fields)
    console.log(files)
    res.end('upload complete')
  })
}

function isFormData(req) {
  // console.log(req)
  var type = req.headers['content-type'] || ''
  console.log(type)
  return type.indexOf('multipart/form-data') == 0
}

// function notFound(res) {
//   res.statusCode = 404
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('Not Found')
// }
//
// function badRequest(res) {
//   res.statusCode = 400
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('Bad Request')
// }

var server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'GET':
      show(res)
      break;
    case 'POST':
      upload(req, res)
      break
  }
})

server.listen(3002)
