const Router = require('express');
const deviceInfoCategorieController = require('../controllers/deviceInfoCategorie.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/deviceInfoCategories', deviceInfoCategorieController.getAll);
router.post('/deviceInfoCategories', checkRole, deviceInfoCategorieController.create);
router.get('/deviceInfoCategorie/:id', checkRole, deviceInfoCategorieController.getOne);
router.patch(
  '/deviceInfoCategorie/updateOrder',
  checkRole,
  deviceInfoCategorieController.updateOrder,
);
router.patch('/deviceInfoCategorie/:id', checkRole, deviceInfoCategorieController.updateOne);
router.delete('/deviceInfoCategorie/:id', checkRole, deviceInfoCategorieController.deleteOne);

module.exports = router;
