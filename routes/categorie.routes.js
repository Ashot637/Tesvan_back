const Router = require('express');
const categorieController = require('../controllers/categorie.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/categories', categorieController.getAll);
router.post('/categories', checkRole, categorieController.create);

module.exports = router;
