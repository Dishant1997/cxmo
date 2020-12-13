const HDWalletProvider = require("@truffle/hdwallet-provider");
var config = require('./config/default.json').common;
const infuraUrl = config.infuraUrl;
const infuraKey = config.infuraKey;
const mnemonic = config.mnemonic;
// const web3 = require('./web3')
console.log(mnemonic)
module.exports = {
  
  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infuraUrl+infuraKey);
      },
      network_id: 3,
      gas: 7000000,   // <--- Twice as much
      gasPrice: 10000000000,
      // gasPrice: 

    },

    // Useful for private networks
    // private: {
      // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
      // network_id: 2111,   // This network is yours, in the cloud.
      // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
