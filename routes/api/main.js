let express = require('express');
let router = express.Router();

let MainController = require('./../../controllers/main');

router.get('/validate', MainController.validate);
router.post('/login', MainController.login);
router.get('/logout', MainController.logout);

module.exports = router;
