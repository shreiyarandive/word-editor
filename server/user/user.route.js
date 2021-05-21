const express = require('express');
const router = express.Router();

const { loginUser, registerUser, verifyAccount } = require('../user/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyAccount', verifyAccount);

module.exports = router;