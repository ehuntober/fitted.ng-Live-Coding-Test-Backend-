
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/superadmin/signup', authController.signupSuperAdmin);
router.post('/superadmin/login', authController.loginSuperAdmin);

router.post('/user/signup', authController.signupUser);
router.post('/user/login', authController.loginUser);



module.exports = router;

