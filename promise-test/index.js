// nodeJS读取文件
const fs = require('fs')
const path = require('path')
// 获取文件名字 path.resolve 通过拼接的方式得到文件路径
// const fullFileNme = path.resolve(__dirname, 'files', 'a.json')

// // 是一个异步操作
// fs.readFile(fullFileNme, (err, data) => {
//   if (err) {
//     console.log(err);
//     return
//   }
//   console.log(data.toString());
// })

// callback方法 获取一个文件的内容
// function getFileContent(fileName, callback) {
//   const fullFileNme = path.resolve(__dirname, 'files', fileName)
//   fs.readFile(fullFileNme, (err, data) => {
//     if (err) {
//       console.log(err);
//       return
//     }
//     callback(JSON.parse(data.toString()))
//   })
// }

// getFileContent('a.json', aData => {
//   console.log('a data', aData);
//   getFileContent(aData.next, bData => {
//     console.log('b data', bData);
//     getFileContent(bData.next, cData => {
//       console.log('c data', cData);
//     })
//   })
// })

// 用Promise获取文件内容。不传回调函数
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileNme = path.resolve(__dirname, 'files', fileName)
    fs.readFile(fullFileNme, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data.toString()))
    })
  })
  return promise
}
// promise的.then方法 .then返回的也是promise对象
// getFileContent('a.json').then(aData => {
//   console.log('a data', aData);
//   return getFileContent(aData.next)
// }).then(bData=>{
//   console.log('b data',bData);
//   return getFileContent(bData.next)
// }).then(cData=>{
//   console.log('c data',cData);
// })

// async await 执行方法返回的是promise对象
async function readFileData() {
  try {
    // await Promise 可以将promise中resolve的内容直接取出来
    const aData = await getFileContent('a.json')
    console.log('adata', aData);
    const bData = await getFileContent(aData.next)
    console.log('bdata', bData);
    const cData = await getFileContent(bData.next)
    console.log(cData);
  } catch (error) {
    console.log(error);
  }

}

readFileData()

// async function readAData() {
//   const aData = await getFileContent('a.json')
//   return aData
// }

// async function test() {
//   const aData = await readAData()
//   console.log(aData);
// }

// test()