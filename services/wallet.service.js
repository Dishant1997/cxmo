const ethUtil = require('ethereumjs-util');
const web3 = require('../web3')
const bip39 = require('bip39')
const hdkey = require('hdkey')
const Web2 = require('web3')
const config = require('../config/default.json').common;
const infuraUrl = config.infuraUrl;
const infuraKey = config.infuraKey;
const HDWalletProvider = require("@truffle/hdwallet-provider");

exports.createWallet = async(req,res) => {
    try{
        const mnemonic = bip39.generateMnemonic() //generates string
      
        const seed = await bip39.mnemonicToSeed(mnemonic)//creates seed buffer
        const root = hdkey.fromMasterSeed(seed)
        const masterPrivateKey = root.privateKey.toString('hex')
        const addrNode = root.derive("m/44'/60'/0'/0/0");
        const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        const addr = ethUtil.publicToAddress(pubKey).toString('hex');
        const address = ethUtil.toChecksumAddress("0x"+addr);

        const respobj = {
            mnemonic:mnemonic,
            walletAddress:address
        }

        return respobj

    }catch(err){
        return err
    }
}

exports.verifyMnemonic = async(mnemonic, userWallet) => {
    try{

        const provider = new HDWalletProvider(
          mnemonic,
          infuraUrl+infuraKey
        );
        const web2 = new Web2(provider)
        const accounts = await web2.eth.getAccounts()
        if(accounts[0] == userWallet){
            return true
        }else{
            return false
        }
    }catch(err){
        return false
    }
}