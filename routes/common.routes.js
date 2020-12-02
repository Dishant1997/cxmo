const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');

const {
    countries,
    states,
    city
    
} = require('../controller/common.controller');

router.get('/country', countries); 
router.get('/state/:country_id', states);
router.get('/city/:state_id',city);

module.exports = router;  