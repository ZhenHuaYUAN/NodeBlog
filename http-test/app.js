const http = require('http')
const queryString = require('querystring')

// const server = http.createServer((req, res) => {
//   console.log(req.method) //GET
//   const url = req.url
//   console.log('url:', url);
//   req.query = queryString.parse(url.split('?')[1])
//   console.log('query:',req.query)
//   res.end(
//     JSON.stringify(req.query)
//   )
// })

// post 请求
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    // 数据格式
    console.log('content-type:', req.headers['content-type'])
    let postData = ''
    // 通过流的方式读取数据。随时来了数据就会出发事件。chunk是二进制格式
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    // 接受完后出发end事件
    req.on('end', () => {
      console.log(postData);
      res.end('hello world')
    })
  }
})


server.listen(8000)