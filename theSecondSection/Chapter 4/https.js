// openssl genrsa 1024 > key.pem 生成一个key.pem的私钥文件
// openssl req -x509 -new -key key.pem > key-cert.pem 生成一个证书
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(3002);
