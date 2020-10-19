var jwt = require('jsonwebtoken');
var config = require('../config');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');

function verifyToken(req, res, next) { 
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(statusConfig.status.forbidden)
        .json({   
            status: statusConfig.errorMessage.status,
            message: 'Please provide a token',  
        });  
      
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(statusConfig.status.error).json({status: statusConfig.errorMessage.status,message: 'Failed to authenticate token.',  
        }); 
        
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  }
  
  module.exports = verifyToken;