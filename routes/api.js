let express = require('express');
let router = express.Router();

/*
1. 未登录 status=400
*/

let mainApi = require('./api/main');
let userApi = require('./api/user');
let clientApi = require('./api/client');

// router.use('*', (req, res, next) => {
//     const sessionId = req.cookies.SESSIONID || '';
//     if(!sessionId) {
//         res.status = 400;
//     }

//     next();
// });

router.use('/user', userApi);
router.use('/client', clientApi);
router.use('/', mainApi);

module.exports = router;
