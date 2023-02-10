let express = require('express');
let router = express.Router();
let GroupController = require('../../controllers/group');

router.get('/list', GroupController.getGroup);
router.get('/info/:id', GroupController.getGroupInfo);
router.post('/add', GroupController.addGroup);
router.put('/update', GroupController.updateGroup);
router.delete('/delete/:id', GroupController.deleteGroup);

module.exports = router;
