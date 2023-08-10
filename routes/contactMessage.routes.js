const Router = require('express');
const contactMessageController = require('../controllers/contactMessage.controller');
const router = new Router();

router.get('/contacts', contactMessageController.getAll);
router.post('/contacts', contactMessageController.create);
router.delete('/contacts/:id', contactMessageController.deleteOne);

module.exports = router;
