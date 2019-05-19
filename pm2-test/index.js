const http = require('http')

const server = http.createServer((req,res)=>{
  // 模拟日志
  console.log('cur time',Date.now());
  // 模拟错误
  console.error('模拟错误11',Date.now())

  if(req.url ==='/err') {
    throw new Error('/err 出錯了')
  }
  res.setHeader('Content-type','application/json')
  res.end(
    JSON.stringify({
      errno:0,
      msg:'pm2 start server 1'
    })
  )
})

server.listen('3000')
console.log('server is listening');