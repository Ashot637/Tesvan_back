const Router = require('express');
const brandController = require('../controllers/brand.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/brands', brandController.getAll);
router.post('/brands', checkRole, brandController.create);
router.get('/brand/:id', checkRole, brandController.getOne);
router.patch('/brand/:id', checkRole, brandController.updateOne);
router.delete('/brand/:id', checkRole, brandController.deleteOne);

module.exports = router;
