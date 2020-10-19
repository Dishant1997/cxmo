const express = require('express');
const router = express.Router();
var path = require('path');
var multer = require('multer');
var VerifyToken = require('../middleware/VerifyToken');

const {
    balance,
    history,
    info,
    transfer,
    rewardTransfer,
    paymentTransfer,
    getTransaction,
    marketPrice,
} = require('../controller/token.controller');

router.get('/balance', VerifyToken, balance);
router.get('/history', VerifyToken, history);
router.get('/info' , VerifyToken, info);
router.get('/transaction', VerifyToken, getTransaction)
router.post('/transfer', VerifyToken, transfer);
router.post('/reward', VerifyToken, rewardTransfer);
router.post('/payment', VerifyToken, paymentTransfer);
router.get('/USDToCrypto', marketPrice);


module.exports = router;
