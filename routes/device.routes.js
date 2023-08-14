const Router = require('express');
const deviceController = require('../controllers/device.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/devices', deviceController.getAll);
router.get('/devices/filters', deviceController.getAllFiltres);
router.get('/device/:id', deviceController.getOne);
router.get('/devices/filter', deviceController.filter);
router.post('/devices/search', deviceController.search);
router.post('/devices/ids', deviceController.getMany);
router.post('/devices', checkRole, deviceController.create);
router.patch('/device/:id', checkRole, deviceController.updateOne);
router.delete('/device/:id', checkRole, deviceController.deleteOne);
router.delete('/remove-info/:id', checkRole, deviceController.removeInfo);
router.post('/upload', checkRole, deviceController.uploadImage);

module.exports = router;
