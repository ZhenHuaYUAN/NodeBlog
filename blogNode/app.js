const querystring = require('querystring')
const {
  get,
  set
} = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')
const {
  access
} = require('./src/utils/log')
// session 数据
// const SESSION_DATA = {}

// 设置cookie过期时间 一天
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log(d.toGMTString());
  return d.toGMTString()
}

// 用于处理post请求中的数据
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  // 设置返回格式
  res.setHeader('Content-Type', 'application/json')
  // 获取path
  const url = req.url
  req.path = url.split('?')[0]
  // 解析query参数
  req.query = querystring.parse(url.split('?')[1])
  // 解析cookie,把字符串形式变成对象形式
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(element => {
    if (!element) {
      return
    }
    const arr = element.split('=')
    const key = arr[0].trim()
    const value = arr[1].trim()
    req.cookie[key] = value
  });

  // 解析session
  // var needSetCookie = false
  // var userId = req.cookie.userid
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 使用redis解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化redis中的session值
    set(userId, {})
  }
  // 获取session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData === null) {
      set(req.sessionId, {})
      // 设置session
      req.session = {}
    } else {
      req.session = sessionData
    }
    console.log(req.session);
    // 处理post请求数据
    return getPostData(req)
  }).then(postData => {
    req.body = postData
    // 处理blog路由 返回的是一个promise
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        // cookie中没有userid的情况弄下执行，生成cookie
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    // 处理user
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中路由
    res.writeHead(404, {
      "Content-type": "text/plain"
    })
    res.write("404 Not Founde\n")
    res.end()
  })
}


module.exports = serverHandle