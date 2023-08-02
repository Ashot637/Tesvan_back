const Router = require('express');
const brandController = require('../controllers/brand.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/brands', brandController.getAll);
router.post('/brands', checkRole, brandController.create);

module.exports = router;
