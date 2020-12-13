const { handleResponse, handleError } = require('../middleware/responsehandler');
const { createWallet, verifyMnemonic } = require('../services/wallet.service');


exports.createUserWallet = async (req, res, next) => {
    try {
        const wallet = await createWallet();
        console.log("Wallet:", wallet);
        
        //const walletUpdate = updateUser(req.session.userDetails._id, wallet.walletAddress);

        return handleResponse({ res, msg: `Wallet of user:`, data: wallet });
      } catch (err) {
        handleError({
          res,
          data: err
        });
      }
    }

exports.verifyLogin = async(req,res) => {
    try{
      const mnemonic = req.body.mnemonic;
      const wallet = req.body.wallet;
      const result = await verifyMnemonic(mnemonic, wallet)
      if(result == true){
        handleResponse({res,data:"Mnemonic Value Matched!!"})
      }else{
        handleError({res,data:"Incorrect Mnemonic value!!"})
      }
    }catch(err){
      console.log(err)
      handleError({res,data:err})
    }
  }