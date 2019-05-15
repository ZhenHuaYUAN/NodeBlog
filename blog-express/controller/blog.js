const {
  exec
} = require('../db/mysql.js')
const xss = require('xss')
const getList = (author, keyword) => {
  // 定义sql语句
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author = '${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // 返回promise
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `select * from blogs where id=${id};`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

// 如果没有默认空对象。
const newBlog = (blogData = {}) => {
  const title = xss(blogData.title)
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()

  const sql = `insert into blogs (title,content,createTime,author) values('${title}','${content}','${createTime}','${author}')`
  // 插入操作数据库返回的数据
  return exec(sql).then(insertData => {
    // console.log(insertData);
    return {
      // 新插入数据的id
      id: insertData.insertId
    }
  })
}

// 更新博客 id是要更新博客的id
const updateBlog = (id, blogData = {}) => {
  const title = blogData.title
  const content = blogData.content
  const sql = `update blogs set title='${title}', content='${content}' where id = ${id};`
  return exec(sql).then(updateData => {
    console.log(updateData);
    // 更新影响的行数
    if (updateData.affectedRows > 0) {
      return true
    } else {
      return error
    }
  })
}

const deleteBlog = (id, author) => {
  const sql = `delete from blogs where id = '${id}' and author = '${author}'`
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}