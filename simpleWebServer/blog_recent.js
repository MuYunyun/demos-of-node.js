// 回调的例子
// const http = require('http')
// const fs = require('fs')
//
// const server = http.createServer(function(req, res) {
//   getTitles(res)
// }).listen(8000, '127.0.0.1')
//
// function getTitles(res) {
//   fs.readFile('./titles.json', function(err, data) {
//     if (err) {
//       hadError(err, res)
//     } else {
//       getTemplate(JSON.parse(data.toString()), res)
//     }
//   })
// }
//
// function getTemplate(titles, res) {
//   fs.readFile('./template.html', function(err, data) {
//     if (err) {
//       hadError(err, res)
//     } else {
//       formatHtml(titles, data.toString(), res)
//     }
//   })
// }
//
// function formatHtml(titles, tmpl, res) {
//   const html = tmpl.replace('%', titles.join('</li><li>'))
//   res.writeHead(200, {'Content-Type': 'text/html'})
//   res.end(html)  // 将HTML页面发送给用户
// }
//
// function hadError(err, res) {
//   console.error(err)
//   res.end('Server Error')
// }

// 通过尽早返回减少嵌套的例子
const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
  getTitles(res)
}).listen(8002, '127.0.0.1')

function getTitles(res) {
  fs.readFile('./titles.json', function(err, data) {
    if (err) {
      return hadError(err, res)
    }
    getTemplate(JSON.parse(data.toString()), res)  // JSON.parse()有效的JSON字符串
  })
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', function(err, data) {
    if (err) {
      return hadError(err, res)
    }
    formatHtml(titles, data.toString(), res)
  })
}

function formatHtml(titles, tmpl, res) {
  console.log(titles)
  const html = tmpl.replace('%', titles.join('</li><li>'))
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(html)  // 将HTML页面发送给用户
}

function hadError(err, res) {
  console.error(err)
  res.end('Server Error')
}
