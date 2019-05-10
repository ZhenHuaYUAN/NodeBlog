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
const handleBlogRouter = (req, res) => {
  const method = req.method //get,post
  const id = req.query.id || ''
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const listData = getList(author, keyword)
    return new SuccessModel(listData)
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    // const id = req.query.id || ''
    const Data = getDetail(id)
    return new SuccessModel(Data)
  }

  // 新建
  if (method === 'POST' && req.path === '/api/blog/new') {
    const blogData = req.body
    const data = newBlog(blogData)
    return new SuccessModel(data)
  }

  // 更新
  if (method === 'POST' && req.path === '/api/blog/update') {
    const blogData = req.body
    const result = updateBlog(id, blogData)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('更新失败')
    }
  }

  // 删除
  if (method === 'POST' && req.path === '/api/blog/del') {
    const result = deleteBlog(id)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('更新失败')
    }
  }
}

module.exports = handleBlogRouter