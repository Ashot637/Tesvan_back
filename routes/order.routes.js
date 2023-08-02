const Router = require('express');
const ordersController = require('../controllers/order.controller');
const router = new Router();

router.get('/orders', ordersController.getAll);
router.post('/orders', ordersController.create);

module.exports = router;
