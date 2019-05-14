const fs = require('fs')
// 路径操作的库 不同平台路径不同
const path = require('path')

const fileName = path.resolve(__dirname,'data.txt')

// 读取文件内容。获取到的data是buffer，二进制格式需要转换为string。如果文件很大时，data会占的内存也会很大
// fs.readFile(fileName,(err,data)=>{
//   if(err) {
//     console.error(err)
//     return
//   }
//   console.log(data.toString());
// })

// 写入文件
// const content = 'lalalalaalla\n'
// const option = {
//   flag:'a' // 写入的内容是追加写入。覆盖用w
// }
// fs.writeFile(fileName,content,option,(err)=>{
//   if(err){
//     console.log(err);
//   }
// })

// 判断文件是否存在
// fs.exists(fileName,(exist)=>{
//   console.log(exist);
// })
// fs.exists(fileName+'1',(exist)=>{
//   console.log(exist);
// })