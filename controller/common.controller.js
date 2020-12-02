const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const { check, validationResult } = require('express-validator');


module.exports.countries=async (req, res) => {

    try {
        var selectQuery = `select * from countries`;

        await db.pool.query(selectQuery).then(function (data) {  
            res.status(statusConfig.status.success) 
            .json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found', 
                data: data.rows,  
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
    } catch (error) {
        
    }
}


//Get state


module.exports.states= async (req, res) => {

    try {
        var selectQuery = `select * from states where country_id='${req.params.country_id}'`;

        await db.pool.query(selectQuery).then(function (data) {  
            res.status(statusConfig.status.success) 
            .json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found', 
                data: data.rows,  
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
    } catch (error) {
        
    }
}


//Get City


module.exports.city= async (req, res) => {

    try {
        var selectQuery = `select * from cities where state_id='${req.params.state_id}'`;

        await db.pool.query(selectQuery).then(function (data) {  
            res.status(statusConfig.status.success) 
            .json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found', 
                data: data.rows,  
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
    } catch (error) {
        
    }
}