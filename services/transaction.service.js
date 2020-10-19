const tokenService = require('./token.service');
const web3 = require('../web3');
const db = require('../models');

module.exports = {
    getTnxHistory: async (userId) => {
        try {
   
            // const USDCTxList = await tokenService.getTxList(address, "USDCTokenAddress");
            // const WBTCTxList = await tokenService.getTxList(address, "WBTCTokenAddress")
            // const RenBTCTxList = await tokenService.getTxList(address, "RenBTCTokenAddress")
            // const FAUTxList = await tokenService.getTxList(address, "FAUTokenAddress");


            var selectQuery = `select * from transactions where user_id = '${userId}'`;
            var getData = await db.pool.query(selectQuery);
            
            if (!getData){
                return false;
            } else {
                return getData;
            }
         
            //     let abc = []
            //     data.forEach(element => {
            //         element.forEach(ele => {
            //             abc.push(ele)
            //         })
            //     })               
            //     return abc
            // })

        } catch (err) {
            return false
        }
    },
    getSentToken: async (address,token) => {
        let tokenName = token
        try {
            const txList =await tokenService.getTxList(address, tokenName)
          
            let amount = 0
            for (let i in txList) {
                if (txList[i].details == 'sent') {
                    amount += Number(txList[i].quantity)
                }
            }
            return Number.parseFloat(amount).toFixed(8)
        } catch (err) {
            return err
        }
    },
    getReceiveToken: async (address,token) => {
        let tokenName = token
        try {
            const txList = await tokenService.getTxList(address, tokenName)
            let amount = 0
            for (let i in txList) {
                if (txList[i].details == 'received') {
                    amount += Number(txList[i].quantity)
                }
            }
            return Number.parseFloat(amount).toFixed(8)
        } catch (err) {
            return err
        }
    },
    getEtherBalance:async(address) => {
        try{
            const balance = await web3.eth.getBalance(address)
            const etherBalance = web3.utils.fromWei(balance.toString(),'ether')
        
            return etherBalance
        }catch(err){
        
            return err
        }
    },  
}