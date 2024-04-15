const Router = require("express");
const ordersController = require("../controllers/order.controller");
const router = new Router();
const checkRole = require("../middleware/checkRole");

router.get("/orders", checkRole, ordersController.getAll);
router.post("/orders", ordersController.create);
router.post("/orders/finish", ordersController.finish);
router.get("/orders/:id", checkRole, ordersController.getOne);
router.delete("/orders/:id", checkRole, ordersController.deleteOne);
router.patch("/orders/:id", checkRole, ordersController.updateOne);

module.exports = router;
