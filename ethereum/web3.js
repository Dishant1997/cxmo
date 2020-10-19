const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const config = require('config')
const infuraUrl = config.get('common.infuraUrl')
const infuraKey = config.get('common.infuraKey')
const mnemonic = config.get('common.mnemonic')

console.log(mnemonic)
console.log(infuraUrl+infuraKey)
const provider = new HDWalletProvider(
  mnemonic,
  infuraUrl+infuraKey
);

const web3 = new Web3(provider);

module.exports = web3