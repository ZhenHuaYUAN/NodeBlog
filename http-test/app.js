const http = require('http')
const queryString = require('querystring')

const server = http.createServer((req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]
  const query = queryString.parse(url.split('?')[1])

  // 设置返回格式为json
  res.setHeader('Content-Type', 'application/json')

  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  }
  // 返回
  if (method === 'GET') {
    // 返回的json格式的字符串
    res.end(JSON.stringify(resData))
  }
  if (method === 'POST') {
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resData.postData = postData
      res.end(JSON.stringify(resData))
    })
  }
})


server.listen(8000)
console.log('ok');