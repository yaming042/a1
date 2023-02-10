let express = require('express');
let router = express.Router();
let RoleController = require('../../controllers/role');

router.get('/list', RoleController.getRole);
router.get('/info/:id', RoleController.getRoleInfo);
router.post('/add', RoleController.addRole);
router.put('/update', RoleController.updateRole);
router.delete('/delete/:id', RoleController.deleteRole);

module.exports = router;
