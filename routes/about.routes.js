const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');
const app = express();
var VerifyToken = require('../middleware/VerifyToken');
var VerifyAdminToken = require('../middleware/verifyIsAdmin');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 20 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    },
});
var cpUpload = upload.fields([{ name: 'tour_thumb', maxCount: 1 }, { name: 'tour_gallery', maxCount: 8 }]);
const {
    getAbout,
    updateAbout,
    updateCryptoWorld,
    getCryptoWorld
    
} = require('../controller/about.controller');
router.post('/update', VerifyToken,cpUpload, updateAbout); 
router.get('/', getAbout); 
router.post('/update/crypto-world', VerifyAdminToken,cpUpload, updateCryptoWorld);
router.get('/crypto_world',getCryptoWorld);

module.exports = router;  