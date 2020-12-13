const db = require('../models');
const express = require('express'); 
const app = express();
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var config = require('../config'); 
const { createWallet, verifyMnemonic } = require('../services/wallet.service');
const multer = require('multer');
const upload = multer(); 
var path = require('path'); 
const fireBase = require('../helpers/firebaseHelper');

app.use('/profile',express.static(path.join(__dirname,'/profile')));  
//update about us  
module.exports.userRegister = async (req, res) => { 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }
    var data = req.body; var insertQuery ='';
    // verfiy Email
    var checkEmailQuery = `select * from users WHERE LOWER(email) = LOWER('${data.email}') OR username = LOWER('${data.username}')`;
  //  var checkEmailQuery = `select * from users  WHERE email ILIKE  '%${data.email}%' OR username ILIKE '%${data.username}%'`;
    console.log(checkEmailQuery);
    var checkData = await db.pool.query(checkEmailQuery);
    var checkMobileQuery = `select * from users WHERE mobile_number = '${data.mobile_number}'`;
    var checkMobileData = await db.pool.query(checkMobileQuery);
    
    if(checkData.rowCount > 0 || checkMobileData.rowCount > 0){ 
        return res.status(statusConfig.status.unauthorized).json({status: statusConfig.errorMessage.status, message:'Either Email or Username or mobile is already used' });
    }
    //register process
    var set = []; var value = [];
    if(typeof data.first_name !== 'undefined' && data.first_name.length>0){
        set.push('first_name');
        value.push(`'${data.first_name}'`); 
    }
    if(typeof data.last_name !== 'undefined' && data.last_name.length>0){
        set.push('last_name'); 
        value.push(`'${data.last_name}'`);
    } 
    if(typeof data.username !== 'undefined' && data.username.length>0){
        set.push('username'); 
        value.push(`'${data.username}'`);
    } 
    if(typeof data.email !== 'undefined' && data.email.length>0){
        set.push('email'); 
        value.push(`'${data.email}'`);
    } 
    if(typeof data.mobile_number !== 'undefined' && data.mobile_number.length>0){
        set.push('mobile_number'); 
        value.push(`'${data.mobile_number}'`);
    }
    if(typeof data.device_token !== 'undefined' && data.device_token.length>0){
        set.push('device_token'); 
        value.push(`'${data.device_token}'`);  
    } 
    if(typeof data.device_name !== 'undefined' && data.device_name.length>0){
        set.push('device_name');  
        value.push(`'${data.device_name}'`); 
    }
    if(typeof data.device_type !== 'undefined' && data.device_type.length>0){
        set.push('device_type');  
        value.push(`'${data.device_type}'`); 
    } 
    if(typeof data.os_version  !== 'undefined' && data.os_version .length>0){
        set.push('os_version');   
        value.push(`'${data.os_version }'`);  
    } 
    if(typeof data.app_version !== 'undefined' && data.app_version.length>0){
        set.push('app_version');  
        value.push(`'${data.app_version}'`); 
    } 
    if(typeof data.password !== 'undefined' && data.password.length>0){
        set.push('password');  
        var hashedPassword = bcrypt.hashSync(data.password, 8);  
        value.push(`'${hashedPassword}'`); 
    }  
    // set role 
    set.push('role_id'); 
    value.push('2'); 
    //add wallet address
    const wallet =  await createWallet(); 
    
    set.push('wallet_address'); 
    value.push(`'${wallet.walletAddress}'`); 
    var insertQuery = `INSERT INTO users(${set.join(',')}) values(${value.join(',')}) RETURNING *`;
    try{
        var response = {}; 
        var getData = await db.pool.query(insertQuery);
        var token = jwt.sign({ id: getData.rows[0].user_id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        response =  getData.rows[0];   
        response.mnemonic =  wallet.mnemonic;   
        res.status(200).json({   
            status: statusConfig.successMessage.status,
            message: 'Congratulations, your account has been created successfully!',  
            token: token,  
            data:response  
        });
     
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

module.exports.userLogin = async (req, res) => { 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }
    var data = req.body;
    var selectQuery = `select * from users where LOWER(username) = LOWER('${data.username}')`;
    var getData = await db.pool.query(selectQuery);  
    try{ 
        if(getData.rows.length>0){ 
            var passwordIsValid = bcrypt.compareSync(req.body.password, getData.rows[0].password);
            if (!passwordIsValid){
                return res.status(statusConfig.status.unauthorized).json({message:'Please make sure your password is correct',token: null }); 
            } 
            if(getData.rows[0].role_id == 2){
                console.log('customer');
                const verify = await verifyMnemonic(data.mnemonic,getData.rows[0].wallet_address); 
                console.log(verify);  
                if(!verify){
                    res.status(statusConfig.status.notfound)  
                    .json({ 
                        status: statusConfig.successMessage.status,
                        message: 'User not found', 
                    });  
                }   
            }    
            //generate token
            var token = jwt.sign({ id: getData.rows[0].user_id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            await updateData(data,getData.rows[0].user_id);
            var response=getData.rows[0];
            response.token=token;
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Welcome back! '+getData.rows[0].first_name+" "+getData.rows[0].last_name,
                token: token,  
                image_path: req.protocol+'://'+req.headers.host+'/profile/',
                data:getData.rows[0] 
            });    
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'User not found', 
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
// update data 
var updateData = async (data,userId) => { 
    updateQuery = ''; 
    updateQuery += 'update users set ';
    if(typeof data.device_token !== 'undefined' && data.device_token.length>0) {
        updateQuery += ` device_token ='${data.device_token}'`; 
    } 
    if(typeof data.device_name !== 'undefined' && data.device_name.length>0) { 
        updateQuery += `,device_name ='${data.device_name}'`; 
    }
    if(typeof data.os_version !== 'undefined' && data.os_version.length>0) { 
        updateQuery += `,os_version ='${data.os_version}'`;  
    }
    if(typeof data.app_version !== 'undefined' && data.app_version.length>0) { 
        updateQuery += `,app_version ='${data.app_version}'`;  
    }
    if(typeof data.device_type !== 'undefined' && data.device_type.length>0) { 
        updateQuery += `,device_type ='${data.device_type}'`; 
    }  
    updateQuery += ` where user_id = '${userId}'`; 
    // console.log(updateQuery);
    await db.pool.query(updateQuery); 
}   
//user profile
module.exports.userProfile = async (req,res) => { 
    var userId = req.userId;
    var selectQuery = `select * from users where user_id = '${userId}'`;
    try{
        var getData = await db.pool.query(selectQuery);

        if(getData.rows.length==1)
        {
            res.status(statusConfig.status.success) 
            .json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found', 
                data: getData.rows[0],   
            });
        }else{
            res.status(statusConfig.status.unauthorized) 
        .json({   
            status: statusConfig.successMessage.status,
            message: 'no Records are found', 
            
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
//update user userProfile
module.exports.updateProfile = async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }  
    const userId = req.userId;
    const data = req.body;
    updateQuery = ''; 
    const file = req.file; 
   
    updateQuery += 'update users set ';
    
    if(typeof data.first_name !== 'undefined' && data.first_name.length>0){
        updateQuery += ` first_name ='${data.first_name}'`; 
    } 
    if(typeof data.last_name !== 'undefined' && data.last_name.length>0){
        updateQuery += `,last_name ='${data.last_name}'`;
    }
    if (file) {   

        var url=await fireBase.uploadImageToStorage (file)
        console.log(url); 
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
//social login
module.exports.getSocialLogin= async (req,res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }
    var data = req.body;
    var selectQuery = `select * from users where social_id = '${data.social_id}' or email='${data.email}'`;
    try{
        var getData = await db.pool.query(selectQuery);
        if(getData.rows.length==1)
        {
            var token = jwt.sign({ id: getData.rows[0].user_id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Welcome back! '+getData.rows[0].first_name+" "+getData.rows[0].last_name,
                token: token,  
                image_path: req.protocol+'://'+req.headers.host+'/profile/',
                data:getData.rows[0] 
            });   
        }else{
            res.status(statusConfig.status.unauthorized)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'User not found, please proceed with register', 
                
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

//Change Password

module.exports.changePassword=async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }

    const userId = req.userId;
    var data = req.body;

    if(typeof data.password !== 'undefined' && data.password.length>0){
       
        var hashedPassword = bcrypt.hashSync(data.password, 8); 
     var   updateQuery = 'update users set ';

    updateQuery += ` password ='${hashedPassword}'`; 

    updateQuery += ` where user_id = '${userId}'`; 

    try {   
        await db.pool.query(updateQuery);
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Password has been updated' 
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

      

    

}

 
