
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/superadmin/signup', authController.signupSuperAdmin);
router.post('/superadmin/login', authController.loginSuperAdmin);

router.post('/user/signup', authController.signupUser);
router.post('/user/login', authController.loginUser);

router.get('/users', authMiddleware, authController.getRegularUsers);
router.get('/users/:username', authMiddleware, authController.getSpecificUserByUsername);

module.exports = router;

