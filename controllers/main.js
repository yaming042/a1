const {v4: uuidv4} = require('uuid');
const md5 = require('crypto-js/md5');
let MainModel = require('./../models/main');
let {RedisSet, RedisGet, RedisDelete} = require('../models/redis');
const {timeLimit} = require('./../config/config.json');

const handleResponse = (input) => {
    if(typeof(input) === 'object' && input.hasOwnProperty('status')) {
        return input;
    }
    return {status: 0, data: input, message: 'success'};
};

class MainController{
    constructor(props){}

    // 是否登录
    async validate(req, res) {
        const sessionId = req.cookies.SESSIONID || '';
        const hasLogin = await RedisGet(sessionId);
        let ret = {status: 0, data: {}, message: 'sucess'};
        if(!hasLogin) {
            ret = {status: 400, data: {}, message: 'not login'};
        }
        res.json(handleResponse(ret));
    }
    // 登录
    async login(req, res) {
        const {username, password} = req.body;
        const user = await MainModel.login(username, password);
        let ret = {};
        if(!user || user.length !== 1) {
            ret = {status: -1, data: {}, message: '登录失败'};
        }else{
            let {status, uid} = user[0] || {};
            if(status !== 2) {
                ret = {status: -1, data: {}, message: '用户状态异常'};
            }else{
                ret = {status: 0, data: {uid: uid}, message: 'success'};
                // 生成token，每个用户的session应该是一样的
                const sessionId = md5(uid).toString();
                // 设置新的 session id
                RedisSet(sessionId, username, timeLimit.userLoginTime);
                // 设置 cookie
                res.cookie('SESSIONID', sessionId, {httpOnly: true, maxAge: timeLimit.userLoginTime});
            }
        }
        res.json(handleResponse(ret));
    }
    // 登出
    async logout(req, res) {
        const sessionId = req.cookies.SESSIONID || '';
        await RedisDelete(sessionId);
        res.cookie('SESSIONID', '', {maxAge: 0});
        res.json(handleResponse('logout sucess'));
    }
}

module.exports = new MainController();