const {
  add,
  mul
} = require('./a')
// lodash Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。
const _ = require('lodash')
const sum = add(10, 20)
console.log(sum);
console.log(mul(10, 20))

const arr = _.concat([1, 2], 3)
console.log('arr...', arr)