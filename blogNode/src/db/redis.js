const redis = require('redis')

const {
  REDIS_CONF
} = require('../conf/db')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
  console.log(err);
})

function set(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

function get(key) {
  // get是异步的形式，要用promise进行封装
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      // 没获取到
      if (val === null) {
        resolve(null)
        return
      }

      try {
        // 把字符串变成对象
        resolve(JSON.parse(val))
      } catch (ex) {
        resolve(val)
      }
    })
  })
  return promise
}

module.exports = {
  set,
  get
}