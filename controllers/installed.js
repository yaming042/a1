const {v4: uuidv4} = require('uuid');
const InstalledModel = require('../models/installed');

const handleResponse = (input) => {
    if(Object.prototype.toString.call(input) === '[object Object]' && input.hasOwnProperty('status')) {
        return input;
    }
    return {status: 0, data: input, message: 'success'};
};

class InstalledController{
    constructor(props){}

    // 应用列表
    async getInstalled(req, res) {
        const users = await InstalledModel.getInstalled();
        res.json(handleResponse(users));
    }
    // 应用信息
    async getInstalledInfo(req, res) {
        const {id} = req.params;
        const info = await InstalledModel.getInstalledInfo(id);
        res.json(handleResponse(info));
    }
    // 新增应用
    async addInstalled(req, res) {
        const defaultPwd = uuidv4();
        const uid = uuidv4().replace(/-/g, '');
        const currentUser = req.cookies.username || '';

        const {email, phone, username, company, password=defaultPwd, sendMail=false} = req.body;
        const postData = {uid, email, phone, username, company, password, created_by: currentUser, updated_by: currentUser};
        const re = await InstalledModel.addInstalled(postData);
        let ret = {...re};

        res.json(handleResponse(ret));
    }
    // 更新应用
    async updateInstalled(req, res) {
        const {id, ...rest} = req.body;
        if(!rest.email || !rest.phone || !rest.username || !rest.company) {
            return res.json(config.responseError.paramsError);
        }
        const users = await InstalledModel.updateInstalled(id, rest);
        res.json(handleResponse(users));
    }
    // 删除应用
    async deleteInstalled(req, res) {
        const id = req.params.id;
        const users = await InstalledModel.deleteInstalled(id);
        res.json(handleResponse(users));
    }
}

module.exports = new InstalledController();