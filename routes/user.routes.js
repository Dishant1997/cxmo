const express = require('express');
const app = express();
const router = express.Router();
var path = require('path');
// middleware for authentication
var VerifyToken = require('../middleware/VerifyToken');
//validation check
const {check, validationResult} = require('express-validator');

const {
    getUsers,
    getCounts
} = require('../controller/user.controller');  

router.post('/', VerifyToken, getUsers); 
router.get('/counts',VerifyToken,getCounts)


module.exports = router;  