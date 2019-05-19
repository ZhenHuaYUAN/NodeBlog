const router = require('koa-router')()

const {
  login
} = require('../controller/user')
const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')


// 前缀
router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  // 数据在app中被处理过
  const {
    username,
    password
  } = ctx.request.body
  const result = await login(username, password)
  if (result.username) {
    ctx.session.username = result.username
    ctx.session.realname = result.realname
    ctx.body = new SuccessModel()
    return 
  }
  ctx.body = new ErrorModel('登录失败')
})

// router.get('/sessionTest', async (ctx, next) => {
//   // viewCount浏览次数
//   if(ctx.session.viewCount === null) {
//     ctx.session.viewCount = 0
//   }
//   ctx.session.viewCount ++ 
//   ctx.body = {
//     errno:0,
//     viewCount:ctx.session.viewCount
//   }
// })

module.exports = router