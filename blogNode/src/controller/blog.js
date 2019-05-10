const getList = (author, keyword) => {
  return [{
    id: 1,
    title: "标题1",
    content: '内容1',
    createTIme: 1557453597396,
    author: '作者1'
  }, {
    id: 2,
    title: "标题2",
    content: '内容2',
    createTIme: 1557453645121,
    author: '作者2'
  }]
}

const getDetail = (id) => {
  return [{
    id: 1,
    title: "标题1",
    content: '内容1',
    createTIme: 1557453597396,
    author: '作者1'
  }]
}
// 如果没有默认空对象。
const newBlog = (blogData = {}) => {
  return {
    id: 3 // 表示新建博客插入到数据表里的id
  }
}

// 更新博客 id是要更新博客的id
const updateBlog = (id, blogData = {}) => {
  return true
}

const deleteBlog = (id) => {
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}