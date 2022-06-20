let express = require('express');
let router = express.Router();
let UserController = require('./../../controllers/user');

router.get('/list', UserController.getUser);
router.get('/info/:id', UserController.getUserInfo);
router.post('/add', UserController.addUser);
router.put('/update', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);
router.post('/sendEmail', UserController.sendEmail);
router.put('/resetPwd', UserController.updatePwd);
router.post('/active', UserController.active);

module.exports = router;
