const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
//validation check
const { check, validationResult } = require('express-validator'); 
const multer = require('multer');
const path = require('path');  

// add video   
const addVideo = async (req,res) => {  
    // const type = req.file.mimetype.split("/");
    const data = req.body;var set = []; var value = [];var insertQuery = '';
    const errors = validationResult(req) 
    if (!errors.isEmpty()) {  
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() }); 
    } 
    const file = req.file
    if (!file) {  
        return res.status(statusConfig.status.error).json({status: statusConfig.errorMessage.status,message: 'Please upload a video.'})  
    } 
    var video_file_name = file.originalname; 
    var file_type = req.file.mimetype; 
    if(typeof video_file_name !== 'undefined' && video_file_name.length>0){ 
        set.push('video_file_name'); 
        value.push(`'${video_file_name}'`);  
    }
    if(typeof data.video_name !== 'undefined' && data.video_name.length>0){ 
        set.push('video_name');  
        value.push(`'${data.video_name}'`);  
    } 
    set.push('video_cat_id');  
    value.push(`'${data.video_cat_id}'`);     
    var insertQuery = `INSERT INTO videos(${set.join(',')}) values(${value.join(',')}) RETURNING video_id`;   
    try{
        var getData = await db.pool.query(insertQuery); 
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Video added', 
            data: getData.rows[0],    
        });
    }
    catch(err){ 
        console.log(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }

}

const getVideo = async(req, res) => {
    const data = req.body; var selectQuery = ''; 
    var selectQuery = '';
    let page = (data.page) ? data.page:1;
    let limit = (data.limit) ? data.limit:1;  
    let offset = (page-1)*limit;
    
    selectQuery = 'select * from videos ';
    if(typeof data.video_cat_id !== 'undefined' && data.video_cat_id.length>0){
        selectQuery += `where video_cat_id ='${data.video_cat_id}'`;
    } 
    if(typeof data.page !== 'undefined'){
        console.log(data.page);
        selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;  
    }  
    try{
        var getData = await db.pool.query(selectQuery);  
        if(getData.rows.length>0){ 
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                video_path :  req.protocol+'://'+req.headers.host+'/uploads/', 
                data:getData.rows 
            });    
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'Records not found', 
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

const addCategory = async(req,res) => {
    var data = req.body;
    var getData = await db.pool.query("INSERT INTO video_categories(cat_name) values($1) RETURNING *",[data.cat_name])
    .then(function (data) { 
        res.set({ 'content-type': 'application/json' });
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Video category created',
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
}
const  getCategory = async(req,res) => {
    var data = req.body;
    var getData = await db.pool.query("select * from video_categories ")
    .then(function (data) { 
        res.set({ 'content-type': 'application/json' });
        if(data.rows.length>0){
            res.status(statusConfig.status.success)
            .json({  
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                data: data.rows,
            });
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'Records not found',
                data: [],
            });
        }
        
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
module.exports = {
    addVideo,
    getVideo,
    addCategory,
    getCategory
}