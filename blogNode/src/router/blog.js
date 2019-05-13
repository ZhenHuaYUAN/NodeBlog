const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog')
const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

// 登录验证
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}
const handleBlogRouter = (req, res) => {
  const method = req.method //get,post
  const id = req.query.id || ''
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)
    // 收到的Promise

    // 识别找自己的
    if(req.query.isadmin) {
      const loginCheckResult = loginCheck(req)
      if(loginCheckResult) {
        return loginCheckResult
      }
      author = req.session.username
    }
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    // const id = req.query.id || ''
    const result = getDetail(id)
    return result.then(Data => {
      return new SuccessModel(Data)
    })
  }

  // 新建
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const blogData = req.body
    blogData.author = req.session.username
    const result = newBlog(blogData)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }
    const blogData = req.body
    const result = updateBlog(id, blogData)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新失败')
      }
    })
  }

  // 删除
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }
    const author = req.session.username
    const result = deleteBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新失败')
      }
    })
  }
}

module.exports = handleBlogRouter