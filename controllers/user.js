const {v4: uuidv4} = require('uuid');
const UserModel = require('./../models/user');
const MailModel = require('./../models/mail');
const {RedisSet, RedisGet, RedisDelete} = require('./../models/redis');
const config = require('./../config/config.json');

// 辅助方法
const hashCode = (str='') => {
    let hash = 0;
    if (str.length > 0) {
        for (let i = 0; i < str.length; i++) {
            hash = 31 * hash + str.charCodeAt(i);
            hash |= 0;
        }
    }
    return hash & 0x7fffffff;
};
// 发送激活链接，将uid和激活码code存进redis
const sendActiveLink = async (uid, email) => {
    let success = true;
    const code = uuidv4();
    // 发送激活邮件
    const emailContent = `<div>
        <p>请点击下方链接进行账号的激活</p>
        <p><a target="_blank" href="${config.webConfig.baseUrl}/user/validate?id=${uid}&code=${code}">
            ${config.webConfig.baseUrl}/user/validate?id=${uid}&code=${code}
        </a></p>
    </div>`;

    try{
        const subject = `欢迎使用A1`;
        const sendEmailSuccess = await MailModel({to: email, subject, emailContent});
        if(sendEmailSuccess) {
            RedisSet(uid, code, config.timeLimit.userValidateTime);
        }
    }catch(e){
        success = false;
    }

    return success;
};

const handleResponse = (input) => {
    if(typeof(input) === 'object' && input.status !== 0) {
        return input;
    }
    return {status: 0, data: input, message: 'success'};
};

class UserController{
    constructor(props){}

    // 用户列表
    async getUser(req, res) {
        const users = await UserModel.getUser();
        res.json(handleResponse(users));
    }
    // 用户信息
    async getUserInfo(req, res) {
        const {id} = req.params;
        const info = await UserModel.getUserInfo(id);
        res.json(handleResponse(info));
    }
    // 新增用户，此时没有密码，需要用户激活时设置密码
    async addUser(req, res) {
        const defaultPwd = uuidv4();
        const uid = uuidv4().replace(/-/g, '');

        const {email, phone, username, company, password=defaultPwd, sendMail=false} = req.body;
        const postData = {uid, email, phone, username, company, password};
        const re = await UserModel.addUser(postData);
        let ret = {...re};
        if(sendMail) {
            const sendSuccess = await sendActiveLink(uid, postData.email);
            if(!sendSuccess) {
                ret['error'] = `邮件发送失败`;
            }
        }

        res.json(handleResponse(ret));
    }
    // 更新用户
    async updateUser(req, res) {
        const {id, ...rest} = req.body;
        if(!rest.email || !rest.phone || !rest.username || !rest.company) {
            return res.json(config.responseError.paramsError);
        }
        const users = await UserModel.updateUser(id, rest);
        res.json(handleResponse(users));
    }
    // 删除用户
    async deleteUser(req, res) {
        const id = req.params.id;
        const users = await UserModel.deleteUser(id);
        res.json(handleResponse(users));
    }
    // 发送激活邮件
    async sendEmail(req, res) {
        const {uid, email} = req.body;
        if(!uid || !email) {
            return res.json(config.responseError.paramsError);
        }
        const sendSuccess = await sendActiveLink(uid, email);
        let ret = {status: 0, data: sendSuccess, message: 'success'};
        if(!sendSuccess) {
            ret = {status: -1, data: sendSuccess, message: '发送邮件失败'};
        }
        res.json(ret);
    }
    // 更新密码
    async updatePwd(req, res) {
        const {id, password} = req.body;
        if(!id || !password) {
            return res.json(config.responseError.paramsError);
        }
        const users = await UserModel.updateUser(id, {password});
        res.json(handleResponse(users));
    }
    // 用户激活
    async active(req, res) {
        // 激活应该有username, password
        const {id, code, password} = req.body;
        if(!id || !code || !password) {
            return res.json(config.responseError.paramsError);
        }
        // 判断id和code是否匹配
        const redisCode = await RedisGet(id);
        if( code !== redisCode ) {
            return res.json({status: -1, data: {}, message: '邮件已过期，请联系管理员重新发送'});
        }
        // 都通过了，更新用户密码
        const users = await UserModel.updateUser(id, {password});
        res.json(handleResponse(users));
    }
}

module.exports = new UserController();