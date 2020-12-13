const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const fireBase=require('../helpers/firebaseHelper')
//validation check
const { check, validationResult } = require('express-validator'); 

const path = require('path');  

const multer = require('multer');
const upload = multer(); 
const express = require('express'); 
const app = express();
app.use('/profile',express.static(path.join(__dirname,'/profile'))); 

//update user statusConfig
module.exports.changeUserStatus=async (req, res) => {

    try{

        
        var selectQuery=`select status,first_name from users where user_id ='${req.params.id}'`;
        console.log(selectQuery);
        var getData = await db.pool.query(selectQuery);
        console.log(getData.rows);
        if(getData.rows.length>0){
            var status=getData.rows[0].status;
            var message=(status == 1 ? getData.rows[0].first_name+" suspended succesfully" : getData.rows[0].first_name+" Activated succesfully");
           status  = (status == 1 ? 0 : 1);
           
            var updateQuery=`update users set status='${status}' where user_id='${req.params.id}'`;
            //console.log(updateQuery);
            var update = await db.pool.query(updateQuery);
            res.status(statusConfig.status.success)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: message, 
               
            });
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'No Users Found', 
               
            });
        }

    }catch (err) {
        console.log(err);
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: err, 
               
            });
        
    }

}



//Get User Listing Created By Gautam Pattani


module.exports.getUsers= async (req, res) => { 

    const data = req.body; var selectQuery = ''; 
    var selectQuery = '';
    let page = (data.page) ? data.page:1;
    let limit = (data.limit) ? data.limit:1;  
    let offset = (page-1)*limit;
    selectQuery = 'select * from users where role_id=2 and status='+req.body.status;

    var countQuery = '';
    
    countQuery = 'select count(*) from users where role_id=2 ';
    active_user=countQuery+" and status=1";
   
    non_active_user=countQuery+"  and status=0";

    if(typeof data.keyword !== 'undefined'){
        console.log(data.page);
        selectQuery += ` and (first_name Like '${data.keyword}%' or last_name Like '${data.keyword}%' or mobile_number Like '${data.keyword}%' or username Like '${data.keyword}%' or email Like '${data.keyword}%')`;  
    }

    if(typeof data.page !== 'undefined'){
        console.log(data.page);
        selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;  
    } 
    console.log(selectQuery);

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

module.exports.userDetail=async (req, res) => {

    try{
        var get=`select * from users where user_id='${req.params.userId}' `;
      
        var getData=await db.pool.query(get);

        
      
        if(getData.rows.length>0)
        {
            var row=getData.rows[0];   
            delete row['password']; 
            delete row['role_id']; 
            res.status(statusConfig.status.success)
            .json({ 
                status: statusConfig.successMessage.status,
               data:row
            });

        }else{
            res.status(statusConfig.status.notfound)
            .json({ 
                status: statusConfig.noteFoundMessage.status,
                message: statusConfig.noteFoundMessage.not_found
            });
        }
    }catch (err) {

        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }
}

module.exports.updateUser=async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }  
    console.log(req.params.userId);
    const data = req.body;
    const userId = req.params.userId;
    updateQuery = ''; 
    const file = req.file; 
    console.log(file);
   
    updateQuery += 'update users set ';
    
    if(typeof data.first_name !== 'undefined' && data.first_name.length>0){
        updateQuery += ` first_name ='${data.first_name}'`; 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, message:"first_name is required" });

    }
    if(typeof data.last_name !== 'undefined' && data.last_name.length>0){
        updateQuery += `,last_name ='${data.last_name}'`;
    }else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, message:"last_name is required" });

    }
    if (file) {   
        console.log(file+" file"); 
        var url=await fireBase.uploadImageToStorage (file);
        updateQuery += `,profile_pic ='${url}'`;  
    } 
    updateQuery += ` where user_id = '${userId}'`;   
     
    try {   
        await db.pool.query(updateQuery);
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Profile has been updated' 
        });  
    } catch (err) {  
        console.log(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }


}