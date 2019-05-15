const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], // app.use
      get: [], // app.get
      post: [] // app.post
    }
  }

  // 注册中间件的方式  第一个参数可能是路径，也可能直接是中间件的函数
  register(path) {
    let info = {}
    // 第一个参数是路由的情况
    if (typeof path === 'string') {
      info.path = path
      // 当前注册信息的所有中间件的信息。从数组的第二个元素开始，变成一个数组的形式存入stack
      info.stack = slice.call(arguments, 1)
    }
    // 第一个参数不是路由，则默认是根路由 
    else {
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }


  use() {
    // 当前函数的所有参数都传入register函数
    const info = this.register.apply(this, arguments)
    this.routes.all.push(info)
  }

  get() {
    const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }

  post() {
    const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
  }

  match(method, url) {
    let stack = []
    // 浏览器主动发送的请求
    if (url === '/favicon.ico') {
      return stack
    }
    // 获取 routes
    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes[method])

    curRoutes.forEach(routeInfo => {
      // 通过url限制。如果routeInfo.path包括在了 url中。就说明访问时需要经过响应的中间件
      if(url.indexOf(routeInfo.path)===0) {
        stack=stack.concat(routeInfo.stack)
      }
    })
    return stack
  }
  // 核心的next机制。执行中间件方法
  handle(req,res,stack) {
    const next = ()=>{
      // 拿到第一个匹配的中间件
      // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
      const middleware = stack.shift()
      if(middleware) {
        // 执行中间件函数
        middleware(req,res,next)
      }
    }
    next()
  }

  callback() {
    return (req, res) => {
      // express的方法
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }
      const url = req.url
      const method = req.method.toLowerCase()
      // 判断注册的中间件哪些需要访问
      const resultList = this.match(method, url)
      this.handle(req,res,resultList)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

// 工厂函数，会产生一个新的对象传输出去
module.exports = () => {
  return new LikeExpress()
}