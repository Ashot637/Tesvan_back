const Router = require('express');
const deviceController = require('../controllers/device.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/devices', deviceController.getAll);
router.get('/device/:id', deviceController.getOne);
router.post('/devices', checkRole, deviceController.create);
router.post('/devices/search', deviceController.search);
router.post('/devices/ids', deviceController.getMany);

module.exports = router;
