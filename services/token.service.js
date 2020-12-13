const ethUtil = require('ethereumjs-util');
const web3 = require('../web3')
var config = require('../config/default.json').common;
const axios = require('axios');
const ethers = require('ethers');
var moment = require('moment');
var Tx = require('ethereumjs-tx')
const db = require('../models');
const { handleResponse, handleError } = require('../middleware/responsehandler');


const etherscanKey = config.etherscanKey;
const etherscanUrl = config.etherscanUrl;
const masterAddress = config.masterAddress;
const masterKey = config.masterPrivateKey;


module.exports = {
getBalance: async (address, token) => {
    let tokenName = token
    try {
        let Token = require('../' + tokenName)
        let balance = await Token.methods.balanceOf(address).call();
        if (token == "FAUToken") {
            balance = Number(balance) / (10 ** 18)
        } else if (token == "USDCToken") {
            balance = Number(balance) / 10 ** 6;
        } else {
            balance = Number(balance);
        }
        return Number.parseFloat(Number(balance)).toFixed(8)
    } catch (err) {
        return false
    }
},

getTokenInfo: async (token) => {
    let tokenName = token
    try {

        const Token = require('../' + tokenName)

        const name = await Token.methods.name().call()
        const symbol = await Token.methods.symbol().call()
        const resObj = {
            name: name,
            symbol: symbol
        }
        return resObj
    } catch (err) {
        return false
    }
},


getTxList: async (address, tokenAdd) => {
    let tokenAddress = tokenAdd
    let contractAddress = '0xac7fa82f7b2937b0714a61c84fa9902224ad5a65'
    try {
        if (tokenAddress == "USDCTokenAddress") {
             contractAddress = config.USDCTokenAddress;
        } else if (tokenAddress == "FAUTokenAddress") {
             contractAddress = config.FAUTokenAddress;
        } else if (tokenAddress == "WBTCTokenAddress") {
             contractAddress = config.WBTCTokenAddress;
        } else if (tokenAddress == "RenBTCTokenAddress") {
             contractAddress = config.RenBTCTokenAddress;
        }
        let txList = await axios(etherscanUrl + 'api?module=account&action=tokentx&contractaddress=' + contractAddress + '&address=' + address + '&page=1&offset=100&sort=asc&apikey=' + etherscanKey + '')

        //https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=0xFab46E002BbF0b4509813474841E0716E6730136&address=0x3126D8380aB928aa357912DDFA60E4c225e53dF3&page=1&offset=100&sort=asc&apikey=TRF47IEMM99Y2GIF1RQP8Z39BDUA21MPY9
        let txnList = []
        txList = txList.data

        for (let i = 0; i < txList.result.length; i++) {
            let date = txList.result[i].timeStamp
            date = new Date(date * 1000)
            let details
            let fromAdd = await ethUtil.toChecksumAddress(txList.result[i].from)
            let toAdd = await ethUtil.toChecksumAddress(txList.result[i].to)
            if (address == fromAdd) {
                details = 'sent'

            }
            if (address == toAdd) {
                details = 'received'

            }
            const respObj = {
                name: txList.result[i].tokenName,
                symbol: txList.result[i].tokenSymbol,
                quantity: Number.parseFloat(Number(txList.result[i].value) / (10 ** 8)).toFixed(8),
                txHash: txList.result[i].hash,
                from: fromAdd,
                to: toAdd,
                dateSting: date.toLocaleString(),
                date: moment(date).format("MM/DD/YYYY HH:mm"),
                details: details,
                gasValue: txList.result[i].gasUsed
            }
            txnList.push(respObj)
        }
        return txnList
    } catch (err) {
        return err
    }
},

getTransaction: async (transactionHash) => {
    try {
        var selectQuery = `select * from transactions where tr_hash = '${transactionHash}'`;
        var getData = await db.pool.query(selectQuery);
        
        if (!getData){
            return false;
        } else {
            return getData;
        }
    } catch(err) {
        return err;
    }
},

tokenTransfer: async (privateKey, fromAddress, toAddress, amount, token, tokenAdd, gasPrices) => {

    let tokenName = token;
    let tokenAddress = tokenAdd;
    privateKey = new Buffer.from(privateKey, 'hex')

    try {
        if (tokenName == "FAUToken") {
            var Amount = BigInt(amount * (10 ** 18));
        } else if (tokenName == "USDCToken") {
            var Amount = amount;
        } else {
            var Amount = amount;
        }

        const nonce = await web3.eth.getTransactionCount(fromAddress)

        if (tokenName == "ETHToken") {
            var rawTx = {
                nonce: web3.utils.toHex(nonce),
                from: fromAddress,
                gasPrice: gasPrices.low * 1000000000, 
                gasLimit: web3.utils.toHex('3000000'),
                to: toAddress,
                value: web3.utils.toHex( web3.utils.toWei(Amount, 'ether') ),
            }

        } else {
            let contractAddress = '0xac7fa82f7b2937b0714a61c84fa9902224ad5a65'

            if (tokenAddress == "USDCTokenAddress") {
                contractAddress = config.USDCTokenAddress;
           } else if (tokenAddress == "FAUTokenAddress") {
                contractAddress = config.FAUTokenAddress;
           } else if (tokenAddress == "WBTCTokenAddress") {
                contractAddress = config.WBTCTokenAddress;
           } else if (tokenAddress == "RenBTCTokenAddress") {
                contractAddress = config.RenBTCTokenAddress;
           }
            let Token = require('../' + tokenName);
            var rawTx = {
                nonce: web3.utils.toHex(nonce),
                from: fromAddress,
                gasPrice: gasPrices.low * 1000000000, 
                gasLimit: web3.utils.toHex('3000000'),
                to: contractAddress,
                value: '0x00',
                data: Token.methods.transfer(toAddress, Amount).encodeABI()
            }
        }
        var tx = new Tx(rawTx, { 'chain': 'ropsten' });
        tx.sign(privateKey);

        var serializedTx = await tx.serialize();

        let result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);

        return result

    } catch (err) {
        return false
    }
},

rewardTransfer: async (toAddress, amount, token, tokenAdd, gasPrices, res) => {

    let tokenName = token;
    let tokenAddress = tokenAdd;
    privateKey = new Buffer.from(masterKey, 'hex')

    try {
        if (tokenName == "FAUToken") {
            var Amount = BigInt(amount * (10 ** 18));
        } else if (tokenName == "USDCToken") {
            var Amount = amount;
        } else {
            var Amount = amount;
        }

        const nonce = await web3.eth.getTransactionCount(masterAddress)

        if (tokenName == "ETHToken") {
            var rawTx = {   
                nonce: web3.utils.toHex(nonce),
                from: masterAddress,
                gasPrice: gasPrices.high * 1000000500, 
                gasLimit: web3.utils.toHex('3000000'),
                to: toAddress,
                value: web3.utils.toHex( web3.utils.toWei(Amount, 'ether') ),
            }
        } else {
            let contractAddress = '0xac7fa82f7b2937b0714a61c84fa9902224ad5a65'

            if (tokenAddress == "USDCTokenAddress") {
                contractAddress = config.USDCTokenAddress;
           } else if (tokenAddress == "FAUTokenAddress") {
                contractAddress = config.FAUTokenAddress;
           } else if (tokenAddress == "WBTCTokenAddress") {
                contractAddress = config.WBTCTokenAddress;
           } else if (tokenAddress == "RenBTCTokenAddress") {
                contractAddress = config.RenBTCTokenAddress;
           }
            
           let Token = require('../' + tokenName);
            var rawTx = {
                nonce: web3.utils.toHex(nonce),
                from: masterAddress,
                gasPrice: gasPrices.low * 1000000000, 
                gasLimit: web3.utils.toHex('3000000'),
                to: contractAddress,
                value: '0x00',
                data: Token.methods.transfer(toAddress, Amount).encodeABI()
            }
        }
        var tx = new Tx(rawTx, { 'chain': 'ropsten' });
        tx.sign(privateKey);
        var serializedTx = await tx.serialize();
        // let result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        //     .on('receipt', console.log);
        let result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(error, txhash){
            if(error){
                return handleResponse({ res, msg: `Transaction failed: wallet does not have enough balance`, data: error });
            } else {
                console.log("TxHash",txhash)
            }
        }).on('receipt', console.log);

        return result;
    } catch (err) {
        return false
    }
},

paymentTransfer: async (privateKey, fromAddress, amount, token, tokenAdd, gasPrices) => {

    let tokenName = token;
    let tokenAddress = tokenAdd;
    privateKey = new Buffer.from(privateKey, 'hex')

    try {
        if (tokenName == "FAUToken") {
            var Amount = BigInt(amount * (10 ** 18));
        } else if (tokenName == "USDCToken") {
            var Amount = amount;
        } else {
            var Amount = amount;
        }

        const nonce = await web3.eth.getTransactionCount(fromAddress)

        if (tokenName == "ETHToken") {
            var rawTx = {
                nonce: web3.utils.toHex(nonce),
                from: fromAddress,
                gasPrice: gasPrices.low * 1000000000, 
                gasLimit: web3.utils.toHex('3000000'),
                to: masterAddress,
                value: web3.utils.toHex( web3.utils.toWei(Amount, 'ether') ),
            }

        } else {
            let contractAddress = '0xac7fa82f7b2937b0714a61c84fa9902224ad5a65'

            if (tokenAddress == "USDCTokenAddress") {
                contractAddress = config.USDCTokenAddress;
           } else if (tokenAddress == "FAUTokenAddress") {
                contractAddress = config.FAUTokenAddress;
           } else if (tokenAddress == "WBTCTokenAddress") {
                contractAddress = config.WBTCTokenAddress;
           } else if (tokenAddress == "RenBTCTokenAddress") {
                contractAddress = config.RenBTCTokenAddress;
           }
            let Token = require('../' + tokenName);
            var rawTx = {
                nonce: web3.utils.toHex(nonce),
                from: fromAddress,
                gasPrice: gasPrices.low * 1000000000, 
                gasLimit: web3.utils.toHex('3000000'),
                to: contractAddress,
                value: '0x00',
                data: Token.methods.transfer(masterAddress, Amount).encodeABI()
            }
        }
        var tx = new Tx(rawTx, { 'chain': 'ropsten' });

        tx.sign(privateKey);

        var serializedTx = await tx.serialize();

        let result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
        
        return result;

    } catch (err) {
        return false
    }
},

storeTransaction: async (userId, fromAddress, toAddress, amount, transaction, type, currency) => {
    try {
        var insertQuery ='';
        var set = []; var value = [];

        set.push('user_id');
        value.push(`'${userId}'`); 

        set.push('tr_hash');
        value.push(`'${transaction.transactionHash}'`); 

        set.push('tr_block_number');
        value.push(`'${transaction.blockNumber}'`); 

        set.push('tr_from_address');
        value.push(`'${fromAddress}'`);

        set.push('tr_to_address');
        value.push(`'${toAddress}'`);

        set.push('tr_amount');
        value.push(`'${amount}'`);

        set.push('tr_gas_price');
        value.push(`'${transaction.gasUsed}'`);

        set.push('tr_status');
        value.push(`'${transaction.status}'`);

        set.push('tr_type');
        value.push(`'${type}'`);

        set.push('tr_currency');
        value.push(`'${currency}'`);

        var insertQuery = `INSERT INTO transactions(${set.join(',')}) values(${value.join(',')}) RETURNING *`;
        var pushData = await db.pool.query(insertQuery);

        return pushData;
    } catch (err) {
        return err;
    }
},

getCurrentGasPrices: async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    }
    return prices;
},

getWallet: async (userId) => {
    try {
        var selectQuery = `select wallet_address from users where user_id = '${userId}'`;
        var getData = await db.pool.query(selectQuery);
   
        if (!getData){
            return false;
        } else {
            return getData.rows[0].wallet_address;
        }
    } catch (err) {
        return err;
    }
},

getPortfolio: async (userId) => {
    try {
        var selectQuery = `select portfolio_value from users where user_id = '${userId}'`;
        var getData = await db.pool.query(selectQuery);
   
        if (!getData){
            return false;
        } else {
            return getData.rows[0].portfolio_value;
        }
    } catch (err) {
        return err;
    }
},

getPrivateKey: async (mnemonic) => {
    try {
        let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let privateKey = mnemonicWallet.privateKey;
   
        if (!privateKey){
                return false;
            } else {
                return privateKey;
            }
    } catch (err) {
        return err;
    }
},

storePortfolio: async (userId, portfolio) => {
    try {
        var updateQuery = `UPDATE users SET portfolio_value = '${portfolio}' where user_id = '${userId}'`;
        var updateData = await db.pool.query(updateQuery);
   
        if (!updateData){
            return false;
        } else {
            return updateData.rows[0];
        }
    } catch (err) {
        return err;
    }
},
}