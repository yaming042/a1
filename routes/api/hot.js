let express = require('express');
let router = express.Router();
let HotController = require('../../controllers/hot');

router.get('/list', HotController.getHot);
router.get('/info/:id', HotController.getHotInfo);
router.post('/add', HotController.addHot);
router.delete('/delete/:id', HotController.deleteHot);

module.exports = router;
