const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
//validation check
const { check, validationResult } = require('express-validator'); 

const path = require('path');  



//Get User Listing Created By Gautam Pattani


module.exports.getUsers= async (req, res) => { 

    const data = req.body; var selectQuery = ''; 
    var selectQuery = '';
    let page = (data.page) ? data.page:1;
    let limit = (data.limit) ? data.limit:1;  
    let offset = (page-1)*limit;
    selectQuery = 'select * from users where role_id=2';

    var countQuery = '';
    
    countQuery = 'select count(*) from users where role_id=2 ';
    active_user=countQuery+" and status=1";
   
    non_active_user=countQuery+"  and status=0";

    if(typeof data.page !== 'undefined'){
        console.log(data.page);
        selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;  
    } 

    try{
        var getData = await db.pool.query(selectQuery);  

        var activeUsers = await db.pool.query(active_user);
        var active  =activeUsers.rows[0];

        var nonActiveUsers = await db.pool.query(non_active_user);
        var nonActive  =nonActiveUsers.rows[0];

        var total = await db.pool.query(countQuery);
        var totalUser  =total.rows[0];

        if(getData.rows.length>0){ 
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                limit: limit,
                activeUser :  active.count, 
                nonActiveUser :  nonActive.count, 
                totalUsers: totalUser.count,
                count :  getData.rows.length,
                page:page, 
                data:getData.rows 
            });    
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'No Users Found', 
                data: [],
            });
        }
    } catch(err) {   
        console.log(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    } 


   
}

module.exports.getCounts= async (req, res) => { 

    const data = req.body; var selectQuery = ''; 
    var selectQuery = '';
    
    selectQuery = 'select count(*) from users where role_id=2 ';
    active_user=selectQuery+" and status=1";
    non_active_user=selectQuery+"  and status=0";


    try{
        var activeUsers = await db.pool.query(active_user);
        var active  =activeUsers.rows[0];

        var nonActiveUsers = await db.pool.query(non_active_user);
        var nonActive  =nonActiveUsers.rows[0];

        var total = await db.pool.query(selectQuery);
        var totalUser  =total.rows[0];
        
        if(activeUsers.rows.length>0){ 
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                activeUser :  active.count, 
                nonActiveUser :  nonActive.count, 
                totalUsers: totalUser.count
            });    
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'No Users Found', 
                data: [],
            });
        }
    } catch(err) {   
        console.log(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    } 


   
}