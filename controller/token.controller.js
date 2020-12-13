const fetch = require('node-fetch')
const { handleResponse, handleError } = require('../middleware/responsehandler');
const { getBalance, getTokenInfo, tokenTransfer, getCurrentGasPrices, rewardTransfer, paymentTransfer, storeTransaction, getTransaction, getWallet, getPrivateKey, storePortfolio, getPortfolio } = require('../services/token.service');
const { getTnxHistory, getEtherBalance } = require('../services/transaction.service');
var config = require('../config/default.json').common;
const masterAddress = config.masterAddress;


  exports.balance = async (req, res) => {
    try {
  
      let userWallet = await getWallet(req.userId);
      if(!userWallet){
        return handleError({ res, msg: `Wallet for this user does not exist` });
      }

      const EtherBalance = await getEtherBalance(userWallet);
      console.log("ETHER BALANCE", EtherBalance)
      const USDCBalance = await getBalance(userWallet,'USDCToken');
      const FAUBalance = await getBalance(userWallet,'FAUToken');
      const WBTCBalance = await getBalance(userWallet,'WBTCToken');
      const RenBTCBalance = await getBalance(userWallet,'RenBTCToken');
      
      const url = 'https://api-pub.bitfinex.com/v2/tickers?symbols=';
      const request = await fetch(`${url}tUDCUSD,tWBTUSD,tETHUSD,tRBTUSD`);
      const response = await request.json();

      const currPortfolio = await getPortfolio(req.userId);
      const total = parseFloat(USDCBalance*response[0][7] + WBTCBalance*response[1][7] + RenBTCBalance*response[3][7] + EtherBalance*response[2][7]).toFixed(2);
        const respObj = {
          USDCBalance: parseFloat(USDCBalance).toFixed(2),
          FAUBalance: parseFloat(FAUBalance).toFixed(2),
          WBTCBalance: parseFloat(WBTCBalance).toFixed(2),
          RenBTCBalance: parseFloat(RenBTCBalance).toFixed(2),
          EtherBalance: parseFloat(EtherBalance).toFixed(2),
          USDCPriceInUSD: parseFloat(response[0][7]).toFixed(2),
          FAUPriceInUSD: 0.02,
          WBTCPriceInUSD: parseFloat(response[1][7]).toFixed(2),
          RenBTCPriceInUSD: parseFloat(response[3][7]).toFixed(2),
          EtherPriceInUSD: parseFloat(response[2][7]).toFixed(2),
          USDCBalanceInUSD: parseFloat(USDCBalance*response[0][7]).toFixed(2),
          FAUBalanceInUSD: parseFloat(FAUBalance*0.02).toFixed(2),
          WBTCBalanceInUSD: parseFloat(WBTCBalance*response[1][7]).toFixed(2),
          RenBTCBalanceInUSD: parseFloat(RenBTCBalance*response[3][7]).toFixed(2),
          EtherBalanceInUSD: parseFloat(EtherBalance*response[2][7]).toFixed(2),
          Total: total,
          PercentageChange: (total - currPortfolio)?parseFloat(((total - currPortfolio)/total)*100).toFixed(2):0
      }

      const updatePortfolio = await storePortfolio(req.userId, respObj.Total);
      return handleResponse({ res, msg: `Wallet tokens Balance for user:`, data: respObj });

    } catch (err) {
      handleError({
        res,
        data: err
      });
    }
  };

  exports.balanceAdmin = async (req, res) => {
    try {
      console.log(masterAddress)
      const EtherBalance = await getEtherBalance(masterAddress);
      console.log("ETHER BALANCE", EtherBalance)
      const USDCBalance = await getBalance(masterAddress,'USDCToken');
      const FAUBalance = await getBalance(masterAddress,'FAUToken');
      const WBTCBalance = await getBalance(masterAddress,'WBTCToken');
      const RenBTCBalance = await getBalance(masterAddress,'RenBTCToken');

      if(EtherBalance<=1) {
        return handleError({ res, msg: `Ether Balance Low:`, data: EtherBalance });
      } else if (USDCBalance<=1) {
        return handleError({ res, msg: `USDC Balance Low:`, data: "low USDC Balance" });
      } else if (FAUBalance<=1) {
        return handleError({ res, msg: `FAU Balance Low:`, data: "low FAU Balance" });
      } else if (WBTCBalance<=1) {
        return handleError({ res, msg: `WBTC Balance Low:`, data: "Low WBTC Balance" });
      } else if (RenBTCBalance<=1) {
        return handleError({ res, msg: `RenBTC Balance Low:`, data: "Low RenBTC Balance" });
      }

      return handleResponse({ res, msg: `No action required:`, data: "true" });

    } catch (err) {
      handleError({
        res,
        data: err
      });
    }
  };

  exports.balanceUser = async (req, res) => {
    try {
  
      //let userWallet = await getWallet(req.userId);
      let userWallet = await getWallet(req.query.id);
      if(!userWallet){
        return handleError({ res, msg: `Wallet for this user does not exist` });
      }
      console.log("User Wallet:", req.query.userId);
      const EtherBalance = await getEtherBalance(userWallet);
      const USDCBalance = await getBalance(userWallet,'USDCToken');
      const FAUBalance = await getBalance(userWallet,'FAUToken');
      const WBTCBalance = await getBalance(userWallet,'WBTCToken');
      const RenBTCBalance = await getBalance(userWallet,'RenBTCToken');
      
      const url = 'https://api-pub.bitfinex.com/v2/tickers?symbols=';
      const request = await fetch(`${url}tUDCUSD,tWBTUSD,tETHUSD,tRBTUSD`);
      const response = await request.json();

      const currPortfolio = await getPortfolio(req.query.id);
      const total = parseFloat(USDCBalance*response[0][7] + WBTCBalance*response[1][7] + RenBTCBalance*response[3][7] + EtherBalance*response[2][7]).toFixed(2);
        const respObj = {
          USDCBalance: parseFloat(USDCBalance).toFixed(2),
          FAUBalance: parseFloat(FAUBalance).toFixed(2),
          WBTCBalance: parseFloat(WBTCBalance).toFixed(2),
          RenBTCBalance: parseFloat(RenBTCBalance).toFixed(2),
          EtherBalance: parseFloat(EtherBalance).toFixed(2),
          USDCPriceInUSD: parseFloat(response[0][7]).toFixed(2),
          FAUPriceInUSD: 0.02,
          WBTCPriceInUSD: parseFloat(response[1][7]).toFixed(2),
          RenBTCPriceInUSD: parseFloat(response[3][7]).toFixed(2),
          EtherPriceInUSD: parseFloat(response[2][7]).toFixed(2),
          USDCBalanceInUSD: parseFloat(USDCBalance*response[0][7]).toFixed(2),
          FAUBalanceInUSD: parseFloat(FAUBalance*0.02).toFixed(2),
          WBTCBalanceInUSD: parseFloat(WBTCBalance*response[1][7]).toFixed(2),
          RenBTCBalanceInUSD: parseFloat(RenBTCBalance*response[3][7]).toFixed(2),
          EtherBalanceInUSD: parseFloat(EtherBalance*response[2][7]).toFixed(2),
          Total: total,
          PercentageChange: (total - currPortfolio)?parseFloat(((total - currPortfolio)/total)*100).toFixed(2):0
      }

      const updatePortfolio = await storePortfolio(req.query.id, respObj.Total);
      return handleResponse({ res, msg: `Wallet tokens Balance for user:`, data: respObj });

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

    const store = await storeTransaction(req.userId, userWallet, req.body.toAddress, req.body.amount, transactions, "transfer", tokenName);
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

    const transactions = await rewardTransfer(userWallet, req.body.amount, tokenName, tokenAddress, gasPrices, res);
    if (transactions == false) {
      return handleError({ res, msg: `Wallet transactions for user failed:`, data: transactions });
    } 

    const store = await storeTransaction(req.userId, "contract owner", userWallet, req.body.amount, transactions, "reward", tokenName);
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
        data: "Wallet does not have enough balance"
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

    const store = await storeTransaction(req.userId, userWallet, "contract owner", req.body.amount, transactions, "payment", tokenName);
    
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