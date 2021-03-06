const Koa = require('./like-koa')
const app = new Koa()

app.use(async (ctx,next) =>{
  console.log('第一层洋葱开始');
  await next()
  const rt = ctx['X-Response-Time']
  console.log(`${ctx.req.method} ${ctx.req.url}-${rt}`);
  console.log('第一层洋葱结束');

})

app.use(async (ctx,next)=>{
  console.log('第二层洋葱开始');
  const start = Date.now()
  await next()
  const ms = Date.now()-start
  ctx['X-Response-Time'] = `${ms}ms`
  console.log('第二层洋葱结束');
})

app.use(async ctx=>{
  console.log('第三层洋葱开始');
  ctx.res.end('this is koa2')
  console.log('第三层洋葱结束');
})

app.listen('3000')