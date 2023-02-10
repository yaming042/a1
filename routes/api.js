let express = require('express');
let router = express.Router();

/*
1. 未登录 status=400
*/

let mainApi = require('./api/main');
let userApi = require('./api/user');
let groupApi = require('./api/group');
let roleApi = require('./api/role');
let hotApi = require('./api/hot');
let installedApi = require('./api/installed');
let clientApi = require('./api/client');

// router.use('*', (req, res, next) => {
//     const sessionId = req.cookies.SESSIONID || '';
//     if(!sessionId) {
//         res.status = 400;
//     }

//     next();
// });

router.use('/user', userApi);
router.use('/group', groupApi);
router.use('/role', roleApi);
router.use('/hot', hotApi);
router.use('/installed', installedApi);
router.use('/client', clientApi);
router.use('/', mainApi);

module.exports = router;
