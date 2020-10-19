const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const { check, validationResult } = require('express-validator');
//update about us 
module.exports.updateAbout = async (req, res) => { 
    // console.log(req.userId);
    const updateQuery = "UPDATE configuration SET about_us = $1 WHERE id = '1' returning *";
    const values = [ 
        req.body.about_us
    ]; 
    await db.pool.query(updateQuery,values).then(function (data) {  
        res.status(statusConfig.status.success) 
        .json({   
            status: statusConfig.successMessage.status,
            message: 'About us updated',  
            data: data.rows[0],  
        }); 
    }) 
    .catch(function (err) {  
        // return next(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }); 
}
//get about us
module.exports.getAbout = async (req, res) => {
    var  selectQuery = "select about_us from configuration where id = '1'"; 
    await db.pool.query(selectQuery).then(function (data) {  
        res.status(statusConfig.status.success) 
        .json({   
            status: statusConfig.successMessage.status,
            message: 'Records are found', 
            data: data.rows[0],  
        }); 
    }) 
    .catch(function (err) {  
        // return next(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }); 
}



module.exports.getCryptoWorld = async (req, res) => {
    var  selectQuery = "select crypto_world from configuration where id = '1'"; 
    await db.pool.query(selectQuery).then(function (data) {  
        res.status(statusConfig.status.success) 
        .json({   
            status: statusConfig.successMessage.status,
            message: 'Records are found', 
            data: data.rows[0],  
        }); 
    }) 
    .catch(function (err) {  
        // return next(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }); 
}


//update Crypto World Content. Created By Gautam Pattani

module.exports.updateCryptoWorld=async (req, res) => {

    const updateQuery = "UPDATE configuration SET crypto_world = $1 WHERE id = '1' returning *";
    const values = [ 
        req.body.crypto_world
    ];

    await db.pool.query(updateQuery,values).then(function (data) {  
        res.status(statusConfig.status.success) 
        .json({   
            status: statusConfig.successMessage.status,
            message: 'Crypto World Updated',  
            data: data.rows[0],  
        }); 
    }) 
    .catch(function (err) {  
        // return next(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }); 


}



