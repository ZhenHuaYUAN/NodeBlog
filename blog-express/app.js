var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
// 解析cookie 经过这个插件的处理可以直接使用req.cookie得到cookie
var cookieParser = require('cookie-parser');
// 记录日志
var logger = require('morgan');
// 处理session
const session = require('express-session')
// 将session中的数据存到redis中
const RedisStore = require('connect-redis')(session)


// 引用路由
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup 视图的设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


const ENV = process.env.NODE_ENV
// 开发或测试环境
if (ENV !== 'production') {
  // 第一个参数是打印日志的格式
  app.use(logger('dev', {
    // 控制台输出
    stream: process.stdout
  }));
}
// 线上环境
else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    // 日志用流输出,线上环境日志写入文件中
    stream: writeStream
  }));
}


// 解析post请求中的内容 在路由中直接用req.body就可以获得
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// redisClient是连接对象
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 解析session
app.use(session({
  // 类似于一个密码 密匙
  secret: 'WJiol#23123_',
  cookie: {
    // cookie在前端每个路由都能用
    path: '/',
    // 前端不能操作cookie
    httpOnly: true,
    // 多久后失效
    maxAge: 24 * 60 * 60 * 1000
  },
  // session存到redis中
  store: sessionStore
}))

// 注册路由  路由会由这里的父路径和router里的子路径拼接形成
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
// 如果是404会给一个相对友好的提示
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;