const Router = require('express');
const deviceController = require('../controllers/device.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/devices', deviceController.getAll);
router.get('/devices/filters', deviceController.getAllFiltres);
router.get('/device/:id', deviceController.getOne);
router.delete('/device/:id', deviceController.deleteOne);
router.patch('/device/:id', deviceController.updateOne);
router.get('/devices/filter', deviceController.filter);
// router.post('/devices', checkRole, deviceController.create);
router.post('/devices', deviceController.create);
router.post('/devices/search', deviceController.search);
router.post('/devices/ids', deviceController.getMany);
router.post('/upload', deviceController.uploadImage);
router.delete('/remove-info/:id', deviceController.removeInfo);

module.exports = router;
