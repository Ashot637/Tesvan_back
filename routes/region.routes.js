const Router = require('express');
const regionController = require('../controllers/region.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.get('/regions', regionController.getAll);
router.post('/regions', checkRole, regionController.create);
router.get('/region/:id', checkRole, regionController.getOne);
router.patch('/region/:id', checkRole, regionController.updateOne);
router.delete('/region/:id', checkRole, regionController.deleteOne);

module.exports = router;
