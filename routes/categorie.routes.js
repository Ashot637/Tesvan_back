const Router = require('express');
const categorieController = require('../controllers/categorie.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/categories', categorieController.getAll);
router.post('/categories', categorieController.create);
router.get('/categorie/:id', categorieController.getOne);
router.patch('/categorie/:id', categorieController.updateOne);
router.delete('/categorie/:id', categorieController.deleteOne);

module.exports = router;
