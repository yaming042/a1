const {v4: uuidv4} = require('uuid');
const HotModel = require('../models/hot');

const handleResponse = (input) => {
    if(Object.prototype.toString.call(input) === '[object Object]' && input.hasOwnProperty('status')) {
        return input;
    }
    return {status: 0, data: input, message: 'success'};
};

class HotController{
    constructor(props){}

    // 应用列表
    async getHot(req, res) {
        const users = await HotModel.getHot();
        res.json(handleResponse(users));
    }
    // 应用信息
    async getHotInfo(req, res) {
        const {id} = req.params;
        const info = await HotModel.getHotInfo(id);
        res.json(handleResponse(info));
    }
    // 新增应用
    async addHot(req, res) {
        const defaultPwd = uuidv4();
        const uid = uuidv4().replace(/-/g, '');
        const currentUser = req.cookies.username || '';

        const {email, phone, username, company, password=defaultPwd, sendMail=false} = req.body;
        const postData = {uid, email, phone, username, company, password, created_by: currentUser, updated_by: currentUser};
        const re = await HotModel.addHot(postData);
        let ret = {...re};

        res.json(handleResponse(ret));
    }
    // 删除应用
    async deleteHot(req, res) {
        const id = req.params.id;
        const users = await HotModel.deleteHot(id);
        res.json(handleResponse(users));
    }
}

module.exports = new HotController();