const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRole');
const headerImageController = require('../controllers/headerImage.controller.js');

router.get('/header', headerImageController.getAll);
router.post('/header', headerImageController.create);

module.exports = router;
