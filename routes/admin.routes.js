const Router = require('express');
const adminController = require('../controllers/admin.controller');
const checkRole = require('../middleware/checkRole');
const router = new Router();

router.post('/auth/registration', adminController.registration);
router.post('/auth/login', adminController.login);
router.post('/auth', checkRole, adminController.authMe);
router.post('/verifyCode', adminController.checkCode);

module.exports = router;
