const Router = require('express');
const brandController = require('../controllers/brand.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/brands', brandController.getAll);
router.post('/brands', brandController.create);
router.get('/brand/:id', brandController.getOne);
router.patch('/brand/:id', brandController.updateOne);
router.delete('/brand/:id', brandController.deleteOne);

module.exports = router;
