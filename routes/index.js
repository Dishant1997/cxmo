const express = require('express');

const router = express.Router();

const wallet = require('./wallet.routes');
const token = require('./token.routes');
/** about api */
const about = require('./about.routes');
/** video api */
const video = require('./video.routes');
/** authentication api */
const auth = require('./authentication.routes');

/** Payment api */
const payment = require('./payment.routes');

/** Common api */
const common = require('./common.routes');

/** Tour Pacakages api */

const tour_pacakges=require('./tour_pacakges.routes');

/** Users api */

const user=require('./user.routes');

router.use('/wallet', wallet);
router.use('/token', token);
router.use('/api/v1/about', about);
router.use('/api/v1/video', video);
router.use('/api/v1/', auth); 
router.use('/api/v1/tour',tour_pacakges);
router.use('/api/v1/user',user);
router.use('/api/v1/payment',payment);
router.use('/api/v1/common',common);
 

module.exports = router; 