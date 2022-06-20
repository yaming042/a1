const redis = require('redis');
const config = require('./../config/config.json');

const redisClient = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
});

//连接错误处理
redisClient.on("error", (err) => {
    console.log("redis connect err", err);
});

redisClient.on("connect", () => {
    console.info("redis connect success");
});

const RedisSet = (key, value, expire='') => {
    if(typeof(value) === 'object') {
        value = JSON.stringify(value);
    }
    redisClient.set(key, value);
    if(typeof(expire) === 'number') {
        RedisExpire(key, expire);
    }
}
const RedisGet = (key) => {
    return new Promise(async (resolve, reject) => {
        redisClient.get(key, (error, value) => {
            if(error) {
                return resolve(null);
            }

            let ret = value;
            try{
                ret = JSON.parse(value);
            }catch(e){};
            return resolve(ret);
        });
    })
}
const RedisDelete = (key) => {
    redisClient.del(key);
}
const RedisExpire = (key, expire) => {
    redisClient.expire(key, expire);
}

module.exports = {
    RedisSet,
    RedisGet,
    RedisDelete,
    RedisExpire
};