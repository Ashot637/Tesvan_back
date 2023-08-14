const Router = require('express');
const contactMessageController = require('../controllers/contactMessage.controller');
const router = new Router();
const checkRole = require('../middleware/checkRole');

router.get('/contacts', checkRole, contactMessageController.getAll);
router.post('/contacts', checkRole, contactMessageController.create);
router.delete('/contacts/:id', checkRole, contactMessageController.deleteOne);

module.exports = router;
