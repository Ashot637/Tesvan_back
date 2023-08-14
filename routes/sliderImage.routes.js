const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRole');
const sliderImageController = require('../controllers/sliderImage.controller.js');

router.get('/slider', sliderImageController.getAll);
router.post('/slider', checkRole, sliderImageController.create);
router.get('/slider/:id', checkRole, sliderImageController.getOne);
router.patch('/slider/:id', checkRole, sliderImageController.updateOne);
router.delete('/slider/:id', checkRole, sliderImageController.deleteOne);

module.exports = router;
