const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect, getProfile);

module.exports = router;