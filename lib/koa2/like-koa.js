const http = require('http')

// 组合中间件函数
function compose(middlewareList) {
  return function (ctx) {
    // 中间件调用的逻辑 next的值通过middlewareList可以找出来
    function dispatch(i) {
      const fn = middlewareList[i]
      try {
        // 中间件处理封装成promise，不管方法上有没有async都不会出错
        return Promise.resolve(
          // 实现next的机制
          fn(ctx, dispatch.bind(null, i + 1))
        )
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }
  // 注册,传入一个异步函数，接收到中间件把它放进去
  use(fn) {
    this.middlewareList.push(fn)
    //加上return this可以使用链式调用
    return this
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    return ctx
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    // 获取当前第一个函数
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx,fn)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = LikeKoa2