const {v4: uuidv4} = require('uuid');
const GroupModel = require('../models/group');
const config = require('../config/config.json');

const handleResponse = (input) => {
    if(Object.prototype.toString.call(input) === '[object Object]' && input.hasOwnProperty('status')) {
        return input;
    }
    return {status: 0, data: input, message: 'success'};
};

class GroupController{
    constructor(props){}

    // 组列表
    async getGroup(req, res) {
        const users = await GroupModel.getGroup();
        res.json(handleResponse(users));
    }
    // 组信息
    async getGroupInfo(req, res) {
        const {id} = req.params;
        const info = await GroupModel.getGroupInfo(id);
        res.json(handleResponse(info));
    }
    // 新增组
    async addGroup(req, res) {
        const defaultPwd = uuidv4();
        const uid = uuidv4().replace(/-/g, '');
        const currentUser = req.cookies.username || '';

        const {email, phone, username, company, password=defaultPwd, sendMail=false} = req.body;
        const postData = {uid, email, phone, username, company, password, created_by: currentUser, updated_by: currentUser};
        const re = await GroupModel.addGroup(postData);
        let ret = {...re};

        res.json(handleResponse(ret));
    }
    // 更新组
    async updateGroup(req, res) {
        const {id, ...rest} = req.body;
        if(!rest.email || !rest.phone || !rest.username || !rest.company) {
            return res.json(config.responseError.paramsError);
        }
        const users = await GroupModel.updateGroup(id, rest);
        res.json(handleResponse(users));
    }
    // 删除组
    async deleteGroup(req, res) {
        const id = req.params.id;
        const users = await GroupModel.deleteGroup(id);
        res.json(handleResponse(users));
    }
}

module.exports = new GroupController();