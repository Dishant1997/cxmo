const fetch = require('node-fetch')
const { handleResponse, handleError } = require('../middleware/responsehandler');
const { getBalance, getTokenInfo, tokenTransfer, getCurrentGasPrices, rewardTransfer, paymentTransfer, storeTransaction, getTransaction, getWallet, getPrivateKey } = require('../services/token.service');
const { getTnxHistory, getEtherBalance } = require('../services/transaction.service');


  exports.balance = async (req, res) => {
    try {
  
      let userWallet = await getWallet(req.userId);
      if(!userWallet){
        return handleError({ res, msg: `Wallet for this user does not exist` });
      }

      const EtherBalance = await getEtherBalance(userWallet);
      const USDCBalance = await getBalance(userWallet,'USDCToken');
      const FAUBalance = await getBalance(userWallet,'FAUToken');
      const WBTCBalance = await getBalance(userWallet,'WBTCToken');
      const RenBTCBalance = await getBalance(userWallet,'RenBTCToken');
      
      const url = 'https://api-pub.bitfinex.com/v2/tickers?symbols=';
      const request = await fetch(`${url}tUDCUSD,tWBTUSD,tETHUSD,tRBTUSD`);
      const response = await request.json();

      await Promise.all([USDCBalance, FAUBalance, WBTCBalance, RenBTCBalance, EtherBalance])
      .then(data => {
      const respObj = {
          USDCBalance: data[0],
          FAUBalance: data[1],
          WBTCBalance: data[2],
          RenBTCBalance: data[3],
          EtherBalance: data[4],
          USDCBalanceInUSD: data[0]*response[0][7],
          WBTCBalanceInUSD: data[2]*response[1][7],
          RenBTCBalanceInUSD: data[3]*response[3][7],
          EtherBalanceInUSD: data[4]*response[2][7],
          Total: data[0]*response[0][7] + data[2]*response[1][7] + data[3]*response[3][7] + data[4]*response[2][7]
      }

      const walletdata = respObj;

      return handleResponse({ res, msg: `Wallet tokens Balance for user:`, data: walletdata });
      })
      .catch(err => {
      handleError({res,data:err})
      })
    } catch (err) {
      handleError({
        res,
        data: err
      });
    }
  };

  exports.history = async (req, res) => {
    try {

    const transactions = await getTnxHistory(req.userId);
    if (transactions == false) {
      return handleError({
        res,
        msg: `Failed to fetch Transaction history for this user`
        });
    }
    return handleResponse({ res, msg: `Wallet transactions for user:`, data: transactions.rows });

    } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };

  exports.getTransaction = async (req, res) => {
    try {
    let transactionHash = req.body.transactionHash;

    const transactions = await getTransaction(transactionHash);
    if (transactions == false) {
      return handleError({
        res,
        msg: `Failed to fetch Transaction for this user`
        });
    }
    return handleResponse({ res, msg: `The transaction was fetched:`, data: transactions.rows });

    } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };

  exports.marketPrice = async (req, res) => {
    try {
    const url = 'https://api-pub.bitfinex.com/v2/tickers?symbols=';
    const amtInUSD = req.query.amount;
    const request = await fetch(`${url}tUDCUSD,tWBTUSD,tETHUSD,tRBTUSD`);
    const response = await request.json();
    
    if (response == null){
      return handleError({
        res,
        msg: `Failed to fetch conversion rate`
        });
    }
    let obj = {};
    obj.USDC = amtInUSD/response[0][7];
    obj.WBTC = amtInUSD/response[1][7];
    obj.ETH = amtInUSD/response[2][7];
    obj.RBTC = amtInUSD/response[3][7];

    return handleResponse({ res, msg: `The market price conversion for all crypto was fetched:`, data: obj});

    } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };

  exports.transfer = async (req, res) => {
    try {
    let userWallet = await getWallet(req.userId);
    if(!userWallet){
      return handleError({ res, msg: `Wallet for this user does not exist` });
    }

    let token = req.body.token;
    let privateKey = await getPrivateKey(req.body.mnemonic);
    let tokenName  = token+'Token';
    let tokenAddress = token+'TokenAddress';
    let gasPrices = await getCurrentGasPrices();

    const transactions = await tokenTransfer(privateKey, userWallet, req.body.toAddress, req.body.amount,tokenName, tokenAddress, gasPrices);

    if (transactions == false) {
      return handleError({ res, msg: `Wallet transactions for user failed:`, data: transactions });
    }

    const store = await storeTransaction(userWallet, req.body.toAddress, req.body.amount, transactions, "transfer", tokenName);
    if (!store && transactions == false) {
      return handleError({ res, msg: `Wallet transactions failed and was not saved:`, data: store });
    } else if (!store && transactions == true) {
      return handleError({ res, msg: `Wallet transactions for user was successful bbut failed to save:`, data: transactions });
    } else {
      return handleResponse({ res, msg: `Wallet transactions for user was successful:`, data: transactions });
    }
  } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };

  exports.rewardTransfer = async (req, res) => {
    try {
    let userWallet = await getWallet(req.userId);
    if(!userWallet){
      return handleError({ res, msg: `Wallet for this user does not exist` });
    }

    let token = req.body.token;
    let tokenName  = token+'Token';
    let tokenAddress = token+'TokenAddress';
    let gasPrices = await getCurrentGasPrices();

    const transactions = await rewardTransfer(userWallet, req.body.amount, tokenName, tokenAddress, gasPrices);

    if (transactions == false) {
      return handleError({ res, msg: `Wallet transactions for user failed:`, data: transactions });
    } 

    const store = await storeTransaction("contract owner", userWallet, req.body.amount, transactions, "reward", tokenName);
    
    if (!store && transactions == false) {
      return handleError({ res, msg: `Wallet transactions failed and was not saved:`, data: store });
    } else if (!store && transactions == true) {
      return handleError({ res, msg: `Wallet transactions for user was successful but failed to save:`, data: transactions });
    } else {
      return handleResponse({ res, msg: `Wallet transactions for user was successful:`, data: transactions });
    }

  } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };


  exports.paymentTransfer = async (req, res) => {
    try {

    let userWallet = await getWallet(req.userId);
    if(!userWallet){
      return handleError({ res, msg: `Wallet for this user does not exist` });
    }

    let token = req.body.token;
    let privateKey = await getPrivateKey(req.body.mnemonic);
    let tokenName  = token+'Token';
    let tokenAddress = token+'TokenAddress';
    let gasPrices = await getCurrentGasPrices();

    const transactions = await paymentTransfer(privateKey, userWallet, req.body.amount,tokenName, tokenAddress, gasPrices);

    if (transactions == false) {
      return handleError({ res, msg: `Wallet transactions for user failed:`, data: transactions });
    } 

    const store = await storeTransaction(userWallet, "contract owner", req.body.amount, transactions, "payment", tokenName);
    
    if (!store && transactions == false) {
      return handleError({ res, msg: `Wallet transactions failed and was not saved:`, data: store });
    } else if (!store && transactions == true) {
      return handleError({ res, msg: `Wallet transactions for user was successful bbut failed to save:`, data: transactions });
    } else {
      return handleResponse({ res, msg: `Wallet transactions for user was successful:`, data: transactions });
    }
  } catch (err) {
        handleError({
        res,
        data: err
        });
    }
  };

  exports.info = async (req, res) => {
    try {

    const FAUToken = await getTokenInfo('FAUToken');
    const USDCToken = await getTokenInfo('USDCToken');
    const WBTCToken = await getTokenInfo('WBTCToken');
    const RenBTCToken = await getTokenInfo('RenBTCToken');

    await Promise.all([USDCToken, FAUToken, WBTCToken, RenBTCToken])
    .then(data => {
      const respObj = {
          USDCToken: data[0],
          FAUToken: data[1],
          WBTCToken: data[2],
          RenBTCToken: data[3]
      }

    const tokenInfo = respObj;

    return handleResponse({ res, msg: `Tokens supported in the wallet:`, data: tokenInfo });
    })
    .catch(err => {
    handleError({res,data:err})
    })
    } catch (err) {
      handleError({
        res,
        data: err
      });
    }
  };