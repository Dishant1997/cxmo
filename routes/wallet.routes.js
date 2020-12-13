const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');
var VerifyToken = require('../middleware/VerifyToken');


const {
    createUserWallet,
    verifyLogin,
} = require('../controller/wallet.controller');

router.post('/createWallet', createUserWallet);
router.post('/verifyMnemonic', verifyLogin);

//router.post('/addMnemonic', addMnemonic);

module.exports = router;
