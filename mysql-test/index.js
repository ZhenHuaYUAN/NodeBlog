const mysql = require('mysql')

// 创建连接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'myblog'
})

// 开始连接
con.connect()

// 执行sql语句

let sql = `update users set realname='振华' where username='panda'`
con.query(sql, (err, result) => {
  if(err) {
    console.log(err);
    return
  }
  console.log(result);
})

sql = `insert into blogs(title,content,createtime,author) value('title2','content2',1557471900714,'panda')`
con.query(sql, (err, result) => {
  if(err) {
    console.log(err);
    return
  }
  console.log(result);
})

sql = 'select * from blogs'
con.query(sql, (err, result) => {
  if(err) {
    console.log(err);
    return
  }
  console.log(result);
})


// 关闭连接
con.end()