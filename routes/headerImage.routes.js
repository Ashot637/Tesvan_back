const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRole');
const headerImageController = require('../controllers/headerImage.controller.js');

router.get('/header', headerImageController.getAll);
router.post('/header', checkRole, headerImageController.create);
router.get('/header/:id', checkRole, headerImageController.getOne);
router.patch('/header/:id', checkRole, headerImageController.updateOne);
router.delete('/header/:id', checkRole, headerImageController.deleteOne);

module.exports = router;
