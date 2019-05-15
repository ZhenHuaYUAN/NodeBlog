const express = require('express')
// 本次http请求的实例
const app = express()

// 前面没有带路径的参数，所有路径都会经过这个函数。这样的函数就是中间件
app.use((req, res, next) => {
  console.log('请求开始', req.method, req.url);
  // next为下一个符合要求的函数，比如get请求，则是下一个app.use或app.get
  next()
})

app.use((req, res, next) => {
  // 假设在处理cookie
  req.cookie = {
    userId: 'abc123'
  }
  next()
})

app.use((req, res, next) => {
  // 假设处理postdata
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    }
  });
  next()
})

app.use('/api', (req, res, next) => {
  console.log('处理api路由');
  next()
})

app.get('/api', (req, res, next) => {
  console.log('get api路由');
  next()
})

app.post('/api', (req, res, next) => {
  console.log('post api路由');
  next()
})

// 模拟登陆验证
function loginCheck(req, res, next) {
  console.log('登陆成功');
  setTimeout(() => {
    next()
  });
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  console.log('get /api/get-cookie');
  res.json({
    errno: 0,
    data: req.cookie
  })
})

app.post('/api/get-post-data', (req, res, next) => {
  console.log('post /api/get-post-data');
  res.json({
    errno: 0,
    data: req.body
  })
})

// app.use((req, res, next) => {
//   console.log('处理404');
//   res.json({
//     errno: -1,
//     msg: '404 not found'
//   })
// })

app.listen(3000, () => {
  console.log('lsitening on localhost:3000');
})