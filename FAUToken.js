const web3 = require('./web3')
const myToken = require('./ethereum/build/contracts/FAUERC20Token.json')
const config = require('./config/default.json').common;
const FAUAddress = config.FAUTokenAddress;

const instance = new web3.eth.Contract(
    JSON.parse(JSON.stringify(myToken.abi)),
    FAUAddress
)

module.exports = instance
