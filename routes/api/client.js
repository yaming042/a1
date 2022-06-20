let express = require('express');
let router = express.Router();

let ClientController = require('./../../controllers/client');

router.get('/list', ClientController.getClient);
router.get('/info/:id', ClientController.getClientInfo);
router.post('/register', ClientController.registerClient);
router.put('/update', ClientController.updateClient);
router.delete('/delete/:id', ClientController.deleteClient);

module.exports = router;
