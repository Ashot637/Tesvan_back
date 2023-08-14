const Router = require('express');
const categorieController = require('../controllers/categorie.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/categories', categorieController.getAll);
router.post('/categories', checkRole, categorieController.create);
router.get('/categorie/:id', checkRole, categorieController.getOne);
router.patch('/categorie/:id', checkRole, categorieController.updateOne);
router.delete('/categorie/:id', checkRole, categorieController.deleteOne);

module.exports = router;
