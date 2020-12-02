const express = require('express');
const router = express.Router();
var path = require('path');
// middleware for authentication
var VerifyToken = require('../middleware/VerifyToken');
//validation check
const {check, validationResult} = require('express-validator');


const {
    ephemeralKeys,
    getPaymentIntent
    
} = require('../controller/payment.controller');

router.post('/ephemeralKeys',VerifyToken, [
    check('apiVersion').isLength({ min: 1 }).withMessage('apiVersion is required')],ephemeralKeys); 

router.post('/getPaymentIntent',VerifyToken,[
    check('price').isLength({ min: 1 }).withMessage('price is required'),check('customer_id').isLength({ min: 1 }).withMessage('customer_id is required')],getPaymentIntent);

module.exports = router;  