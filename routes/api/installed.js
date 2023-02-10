let express = require('express');
let router = express.Router();
let InstalledController = require('../../controllers/installed');

router.get('/list', InstalledController.getInstalled);
router.get('/info/:id', InstalledController.getInstalledInfo);
router.post('/add', InstalledController.addInstalled);
router.delete('/delete/:id', InstalledController.deleteInstalled);

module.exports = router;
