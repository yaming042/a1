const {urlencoded} = require('express');
let express = require('express');
let path = require('path');
let router = express.Router();

const app = {
    client_id: 'test',
    client_secret: 'abc',
    callback: 'http://localhost:5002/oauth/callback',
    name: '测试App',
    icon: 'http://localhost:3333/images/d2.png'
};
const sso = {
    tokenUrl: 'http://localhost:3333/oauth/token',
    code: 'testcode',
    access: {
        access_token: '1',
        token_type: 'beare',
        expires_in: 10000,
        refresh_token: 'refresh_token',
        scope: 'all'
    }
};

const userDb = {
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    fullName: '',
    company: '',
    roles: [],
    groups: [],
};
const clientDb = {
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    name: '',
    logo: '',
};
const refreshTokenDb = {
    refreshToken: '',
    clientId: '',
    userId: '',
    expires: '',
};
const codeDb = {
    code: '',
    clientId: '',
    userId: '',
    expires: '',
};
const tokenDb = {
    accessToken: '',
    clientId: '',
    userId: '',
    expires: '',
};

/* GET home page. */
router.get('/authorize', function (req, res, next) {
    // xxxxx/oauth/authorize?response_type=oken&client_id=1234&redirect_uri=xxxxx
    // 拿到参数，跳转到登录页面
    /*
        1. 判断是否登录，如果登录，那么就展示授权，如果没有登录，那么就展示登录
    */
    const {response_type, client_id, redirect_uri} = req.query;
    res.render('login', {error: '', response_type: response_type, client_id: client_id, redirect_uri: redirect_uri});
});
router.post('/authorize', function (req, res, next) {
    // 登录信息提交到这里，开始校验，成功后展示授权页面
    const {username, password, response_type, client_id, redirect_uri} = req.body;
    // 1. 对比username和password
    if(!username || !password){
        return res.render('login', {error: '用户名或密码不能为空', response_type: response_type, client_id: client_id, redirect_uri: redirect_uri});
    }
    // 2. 根据client_id获取应用的注册信息
    const clientInfo = {
        name: app.name,
        icon: app.icon,
    };
    // 3. 上面步骤都成功后跳转到授权页， authorization，并把需要的信息传递过去
    // 渲染 授权页
    res.render('authorization', {deny: '', clientInfo: clientInfo, response_type: response_type, client_id: client_id, redirect_uri: redirect_uri});
});

router.post('/authorization', function (req, res, next) {
    const {confirm, cancel, relogin, response_type, client_id, redirect_uri} = req.body;
    const clientInfo = {
        name: app.name,
        icon: app.icon,
        callback: app.callback,
    };
    // 1. 如果取消授权，那么重定向到redirect_uri并携带取消授权信息
    if(cancel == 0){
        return res.render('authorization', {deny: 'user deny access', clientInfo: clientInfo, response_type: response_type, client_id: client_id, redirect_uri: redirect_uri});
    }else if(relogin == 1){
        return res.render('login', {error: '', response_type: response_type, client_id: client_id, redirect_uri: redirect_uri});
    }else{
        // 2. 根据client_id获取App注册信息
        // 如上已取到
        // 3. 生成code
        const code = sso.code;
        // 向app发送请求
        res.redirect(301, `${clientInfo.callback}?code=${code}&redirect_uri=${redirect_uri}`);
        // 授权成功后，向对应app的redirect_uri发送请求，携带code，app收到请求后，用code再向授权服务请求token，成功后返回access_token，完成整个过程
    }
});
// 获取token
router.get('/token', (req, res, next) => {
    const {client_id, client_secret, code, grant_type} = req.query;
    if(client_id == app.client_id && client_secret == app.client_secret && code == sso.code){
        res.json({
            status: 200,
            data: sso.access,
            message: 'success'
        });
    }else{
        res.json({name: 1});
    }
});

module.exports = router;
