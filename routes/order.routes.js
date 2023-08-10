const Router = require('express');
const ordersController = require('../controllers/order.controller');
const router = new Router();

router.get('/orders', ordersController.getAll);
router.post('/orders', ordersController.create);
router.get('/orders/:id', ordersController.getOne);
router.delete('/orders/:id', ordersController.deleteOne);

module.exports = router;
