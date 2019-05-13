const redis = require('redis')

// 创建redis客户端 (端口，ip)
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err => {
  console.error(err);
})

// 测试  redis.print插入完后打印出来是否正确
redisClient.set('myname','zhangsan',redis.print)
redisClient.get('myname',(err,val)=>{
  if(err) {
    console.log(err);
    return
  }
  console.log('val:',val);
  // 退出redis
  redisClient.quit()
})

