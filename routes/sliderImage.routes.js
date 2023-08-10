const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRole');
const sliderImageController = require('../controllers/sliderImage.controller.js');

router.get('/slider', sliderImageController.getAll);
router.post('/slider', sliderImageController.create);
router.get('/slider/:id', sliderImageController.getOne);
router.patch('/slider/:id', sliderImageController.updateOne);
router.delete('/slider/:id', sliderImageController.deleteOne);

module.exports = router;
