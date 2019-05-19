const {
  exec
} = require('../db/mysql.js')
const xss = require('xss')

const getList = async (author, keyword) => {
  // 定义sql语句
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author = '${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // 返回promise 中resolve的值
  return await exec(sql)
}

const getDetail = async (id) => {
  let sql = `select * from blogs where id=${id};`
  const rows = await exec(sql)
  return rows[0]
  // return await exec(sql).then(rows => {
  //   return rows[0]
  // })
}

// 如果没有默认空对象。
const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title)
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()

  const sql = `insert into blogs (title,content,createTime,author) values('${title}','${content}','${createTime}','${author}')`
  // 插入操作数据库返回的数据
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

// 更新博客 id是要更新博客的id
const updateBlog = async (id, blogData = {}) => {
  const title = blogData.title
  const content = blogData.content
  const sql = `update blogs set title='${title}', content='${content}' where id = ${id};`
  const updataData = await exec(sql)
  console.log(updataData.affectedRows);
  if(updataData.affectedRows > 0) {
    return true
  }
  return false
}

const deleteBlog = async (id, author) => {
  const sql = `delete from blogs where id = '${id}' and author = '${author}'`
  const deleteData = await exec(sql)
  if(deleteData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}