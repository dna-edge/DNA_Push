/******************************************************************************
' 파일     : global.js
' 작성     : 박소영
' 목적     : DB나 등 전역으로 쓰이는 모듈을 모아놓은 파일입니다.
******************************************************************************/

/* redis */
const redis = require('redis').createClient(process.env.REDIS_PORT, process.env.EC2_HOST);
redis.auth(process.env.REDIS_PASSWORD);

module.exports.redis = redis;