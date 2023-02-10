let {v4: uuidv4} = require('uuid');
const ClientModel = require('./../models/client');
const MailModel = require('./../models/mail');
let {RedisSet, RedisGet, RedisDelete} = require('./../models/redis');

/*
    这里应该有一个专门的应用来供client注册(需要审核)，查看，编辑(基础信息)，甚至删除
*/

// 将clientId, clientSecret发送到指定邮箱
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
        const sendEmailSuccess = await MailModel({to: email, subject, content: emailContent});
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

class ClientController{
    constructor(props){}

    // client列表
    async getClient(req, res) {
        const users = await ClientModel.getClient();
        res.json(handleResponse(users));
    }
    // client信息
    async getClientInfo(req, res) {
        const {id} = req.params;
        const info = await ClientModel.getClientInfo(id);
        res.json(handleResponse(info));
    }
    // 新增client
    async registerClient(req, res) {
        const defaultPwd = uuidv4();
        const uid = uuidv4().replace(/-/g, '');

        const {email, phone, username, company, password=defaultPwd, sendMail=false} = req.body;
        const postData = {uid, email, phone, username, company, password};
        const re = await ClientModel.addClient(postData);
        let ret = {...re};
        if(sendMail) {
            const sendSuccess = await sendActiveLink(uid, postData.email);
            if(!sendSuccess) {
                ret['error'] = `邮件发送失败`;
            }
        }

        res.json(handleResponse(ret));
    }
    // 更新client
    async updateClient(req, res) {
        const {id, ...rest} = req.body;
        if(!rest.email || !rest.phone || !rest.username || !rest.company) {
            return res.json(config.responseError.paramsError);
        }
        const users = await ClientModel.updateClient(id, rest);
        res.json(handleResponse(users));
    }
    // 删除client
    async deleteClient(req, res) {
        const id = req.params.id;
        const users = await ClientModel.deleteClient(id);
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
            ret = {status: -1, data: sendSuccess, message: '发送邮件失败'}
        }
        res.json(ret);
    };
}

module.exports = new ClientController();