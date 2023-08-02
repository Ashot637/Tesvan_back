const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRole');
const sliderImageController = require('../controllers/sliderImage.controller.js');

router.get('/slider', sliderImageController.getAll);
router.post('/slider', sliderImageController.create);

module.exports = router;
