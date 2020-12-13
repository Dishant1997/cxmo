const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
var config = require('./config/default.json').common;
const infuraUrl = config.infuraUrl;
const infuraKey = config.infuraKey;
const mnemonic = config.mnemonic;

console.log(mnemonic)
console.log(infuraUrl+infuraKey)
const provider = new HDWalletProvider(
  mnemonic,
  infuraUrl+infuraKey
);

const web3 = new Web3(provider);

module.exports = web3