const router = require('koa-router')()

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
const loginCheck = require('../middleware/loginCheck')

// 前缀
router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  let keyword = ctx.query.keyword || ''
  if (ctx.query.isadmin) {
    console.log(ctx.session.username);
    if (!ctx.session.username) {
      ctx.body = new ErrorModel('未登录')
      return
    }
    author = ctx.session.username
  }
  const result = await getList(author, keyword)
  ctx.body = new SuccessModel(result)
})

router.get('/detail', async (ctx, next) => {
  let id = ctx.query.id
  const result = await getDetail(id)
  ctx.body = new SuccessModel(result)
})

router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  console.log(ctx.request.body);
  const result = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(result)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const result = await updateBlog(ctx.query.id, ctx.request.body)
  if (result) {
    ctx.body = new SuccessModel()
    return
  }
  ctx.body = new ErrorModel('更新失败')
})

router.post('/del', loginCheck, async (ctx, next) => {
  const id = ctx.query.id
  const author = ctx.session.username
  const result = await deleteBlog(id, author)
  if (result) {
    ctx.body = new SuccessModel()
    return
  }
  ctx.body = new ErrorModel('删除失败')
})

module.exports = router