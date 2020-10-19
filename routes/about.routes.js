const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');
var VerifyToken = require('../middleware/VerifyToken');
var VerifyAdminToken = require('../middleware/verifyIsAdmin');
const {
    getAbout,
    updateAbout,
    updateCryptoWorld,
    getCryptoWorld
    
} = require('../controller/about.controller');
router.post('/update', VerifyToken, updateAbout); 
router.get('/', getAbout); 
router.post('/update/crypto-world', VerifyAdminToken, updateCryptoWorld);
router.get('/crypto_world',getCryptoWorld);
module.exports = router;  