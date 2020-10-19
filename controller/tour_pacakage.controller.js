const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const { check, validationResult } = require('express-validator');
var config = require('../config');
const multer = require('multer');
const express = require('express');
const upload = multer(); 
const app = express();
var path = require('path'); 
app.use('/tours',express.static(path.join(__dirname,'/tours')));  


//get about us
module.exports.getTourCategories = async (req, res) => {
    var data = req.body;
    var getData = await db.pool.query("select * from tour_categories order by tour_categories_id desc")
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




//Add getTourCategories

module.exports.addTourCategories = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }
    var data = req.body;
    var getData = await db.pool.query("INSERT INTO tour_categories(tour_category_name) values($1) RETURNING *",[data.tour_category_name])
    .then(function (data) { 
        res.set({ 'content-type': 'application/json' });
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Tour Category category created',
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


//update Category

module.exports.updateTourCategories = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }
    var data = req.body;

    updateQuery = 'update tour_categories set ';
    
    updateQuery += ` tour_category_name ='${data.tour_category_name}'`; 

    updateQuery += ` where tour_categories_id = '${data.tour_categories_id}'`; 
    console.log("updateQuery "+updateQuery);
    var getData = await db.pool.query(updateQuery)
    .then(function (data) { 
        res.set({ 'content-type': 'application/json' });
        res.status(statusConfig.status.success)
        .json({  
            status: statusConfig.successMessage.status,
            message: 'Tour Category category created',
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

//Add tour pacakages

module.exports.updateTour= async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }  
   
    
    var data = req.body; var insertQuery ='';
    var set = []; var value = [];
    const file = req.files; 
  //  const tour_thumb=req.files.tour_thumb[0].originalname;
   // 

    if(typeof data.tour_pacakage_id == 'undefined' || data.tour_pacakage_id.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Tour pacakage Id is required" });
    } 

    if(typeof data.tour_pacakage_name == 'undefined' || data.tour_pacakage_name.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Tour pacakage name is required" });
    } 

    if(typeof data.tour_categories_id == 'undefined' || data.tour_categories_id.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Category is required" });
    } 

    if(typeof data.itinerary == 'undefined' || data.itinerary.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Itinerary is required" }); 
    } 

    if(typeof data.duration == 'undefined' || data.duration.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Duration is required" });
    } 

    if(typeof data.tour_overview == 'undefined' || data.tour_overview.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"tour_overview is required" });
    } 

    

    if(typeof data.ratings == 'undefined' || data.ratings.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Rating is required" }); 
    } 

    if(typeof data.tour_tags_id == 'undefined' || data.tour_tags_id.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Tour Tag is required" });
    } 

    if(typeof data.package_price == 'undefined' || data.package_price.length<=0){
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"package_price is required" });
    } 



    updateQuery = 'update tour_pacakage set ';
    
    updateQuery += ` tour_pacakage_name ='${data.tour_pacakage_name}'`; 

    updateQuery += `, tour_categories_id ='${data.tour_categories_id}'`; 

    updateQuery += `, itinerary ='${data.itinerary}'`; 

    updateQuery += `, duration ='${data.duration}'`; 

    updateQuery += `, ratings ='${data.ratings}'`; 

    updateQuery += `, tour_tags_id ='${data.tour_tags_id}'`; 
    updateQuery += `, package_price ='${data.package_price}'`; 
    updateQuery += `, tour_overview ='${data.tour_overview}'`; 


    if(req.files.tour_thumb!=null)
    {
        const   tour_thumb=req.files.tour_thumb[0].originalname;
        
        if(typeof tour_thumb !== 'undefined' && tour_thumb.length>0){
            updateQuery += `, tour_thumb ='${tour_thumb}'`;  
        } 
    }else{
        console.log("console.log(tour_thumb);");
    }


    

    updateQuery += ` where tour_pacakage_id = '${data.tour_pacakage_id}'`; 

    console.log("console.log(tour_thumb); "+updateQuery);
    try{
        var response = {}; 
        var getData = await db.pool.query(updateQuery);
        
        response =  getData.rows[0]; 
        console.log("console.log(tour_thumb); "+response);
        
            tour_pacakage_id= data.tour_pacakage_id;

            if(req.files.tour_gallery!=null)
            {
                for (let index = 0; index < req.files.tour_gallery.length; index++) {
                    await updateTourGallery(req.files.tour_gallery[0].originalname,tour_pacakage_id);
                }
            }

             res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Tour has been updates  successfully!',  
                image_path: req.protocol+'://'+req.headers.host+'/tours/',
                
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



//upload Tour Gallery



var updateTourGallery = async (data,tour_pacakage_id) => { 
    
  
    var set = []; var value = [];
    if(typeof data !== 'undefined' && data.length>0){
        set.push('image_path');
        value.push(`'${data}'`); 
    } 

    if(typeof tour_pacakage_id !== 'undefined' ){
        console.log(tour_pacakage_id);
        set.push('tour_pacakage_id');
        value.push(`'${tour_pacakage_id}'`); 
    } 
    var insertQuery = `INSERT INTO tour_pacakage_images(${set.join(',')}) values(${value.join(',')}) RETURNING *`;
     console.log(insertQuery);
     try{
        await db.pool.query(insertQuery); 
    }catch (err) {}
    //await db.pool.query(updateQuery); 
} 


//Add Tour Pacakage



module.exports.addTour= async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
    }  
   
   // return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:req.files });
    var data = req.body; var insertQuery ='';
    var set = []; var value = [];
    const file = req.files; 
    console.log(req.files);
    
    



    if(typeof data.tour_pacakage_name !== 'undefined' && data.tour_pacakage_name.length>0){
        set.push('tour_pacakage_name');
        value.push(`'${data.tour_pacakage_name}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Tour pacakage name is required" });
    }

    if(typeof data.tour_categories_id !== 'undefined' && data.tour_categories_id.length>0){
        set.push('tour_categories_id');
        value.push(`'${data.tour_categories_id}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Category is required" });
    }

    if(typeof data.itinerary !== 'undefined' && data.itinerary.length>0){
        set.push('itinerary');
        value.push(`'${data.itinerary}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Itinerary is required" });
    }

    if(typeof data.duration !== 'undefined' && data.duration.length>0){
        set.push('duration');
        value.push(`'${data.duration}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Duration is required" });
    }

    if(typeof data.tour_overview !== 'undefined' && data.tour_overview.length>0){
        set.push('tour_overview');
        value.push(`'${data.tour_overview}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"tour_overview is required" });
    }


    
    
    

    if(typeof data.ratings !== 'undefined' && data.ratings.length>0){
        set.push('ratings');
        value.push(`'${data.ratings}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Rating is required" });
    }

    if(typeof data.tour_tags_id !== 'undefined' && data.tour_tags_id.length>0){
        set.push('tour_tags_id');
        value.push(`'${data.tour_tags_id}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Tour Tag is required" });
    }

    if(typeof data.package_price !== 'undefined' && data.package_price.length>0){
        set.push('package_price');
        value.push(`'${data.package_price}'`); 
    } else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"package_price is required" });
    }

    if(req.files.tour_thumb!=null)
    {
        const   tour_thumb=req.files.tour_thumb[0].originalname;
        console.log(tour_thumb);
        if(typeof tour_thumb !== 'undefined' && tour_thumb.length>0){
            set.push('tour_thumb');
            value.push(`'${tour_thumb}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Thumbnail  is required" });
        }
    }else{
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Thumbnail  is required" });
    }

   



    var insertQuery = `INSERT INTO tour_pacakage(${set.join(',')}) values(${value.join(',')}) RETURNING *`;
    console.log(insertQuery);
    
    try{
        var response = {}; 
        var getData = await db.pool.query(insertQuery);
        
        response =  getData.rows[0]; 
       
        if(response!=null)
        {
            tour_pacakage_id= response.tour_pacakage_id;
            if(req.files.tour_gallery!=null)
            {
            for (let index = 0; index < req.files.tour_gallery.length; index++) {
                await updateTourGallery(req.files.tour_gallery[index].originalname,tour_pacakage_id);
            }

                var gallery=await getTourPacageGallery(tour_pacakage_id);
                response.gallery=gallery;
             }
            
          
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Tour has been added successfully!',  
                image_path: req.protocol+'://'+req.headers.host+'/tours/',
                data:response  
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


//Get Tours


module.exports.getTour=async (req, res) => {

    const data = req.body; var selectQuery = ''; 
    var selectQuery = '';
    let page = (data.page) ? data.page:1;
    let limit = (data.limit) ? data.limit:1;  
    let offset = (page-1)*limit;
    
    //selectQuery = 'select * from tour_pacakage  inner join tour_categories on tour_categories.tour_categories_id=tour_pacakage.tour_categories_id';
    selectQuery = 'select * from tour_pacakage  inner join tour_categories on tour_categories.tour_categories_id=tour_pacakage.tour_categories_id inner join  tour_tags on tour_tags.tour_tags_id=tour_pacakage.tour_tags_id';
    countQuery = 'select count(*) from tour_pacakage ';
    if(typeof data.tour_categories_id !== 'undefined' && data.tour_categories_id.length>0 && typeof data.tour_tags_id !== 'undefined' && data.tour_tags_id.length>0){
        selectQuery += ` where tour_pacakage.tour_categories_id ='${data.tour_categories_id}'`;
        selectQuery += ` and tour_pacakage.tour_tags_id ='${data.tour_tags_id}'`;


        countQuery += ` where tour_pacakage.tour_categories_id ='${data.tour_categories_id}'`;
        countQuery += ` and tour_pacakage.tour_tags_id ='${data.tour_tags_id}'`; 
    } else{
        if(typeof data.tour_categories_id !== 'undefined' && data.tour_categories_id.length>0){
            selectQuery += ` where tour_pacakage.tour_categories_id ='${data.tour_categories_id}'`;
            countQuery += ` where tour_pacakage.tour_categories_id ='${data.tour_categories_id}'`;
        } 

        if(typeof data.tour_tags_id !== 'undefined' && data.tour_tags_id.length>0){
            selectQuery += ` where tour_pacakage.tour_tags_id ='${data.tour_tags_id}'`;
            countQuery += ` where tour_pacakage.tour_tags_id ='${data.tour_tags_id}'`;
        } 

    }
    
    
    console.log(countQuery);
    if(typeof data.page !== 'undefined'){
        console.log(data.page);
        selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;  
    } 
    
    

    
    try{
        var getData = await db.pool.query(selectQuery);  
        var countData = await db.pool.query(countQuery);
        totalCounts=countData.rows[0].count;
        if(getData.rows.length>0){ 
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                image_path :  req.protocol+'://'+req.headers.host+'/tours/', 
                page:page,
                records:getData.rows.length,
                totalCounts:parseInt(totalCounts),
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


//Get Tour Detail

module.exports.getTourDetail= async (req, res) => {
    console.log(req.params.id);
   
    selectQuery = 'select * from tour_pacakage  inner join tour_categories on tour_categories.tour_categories_id=tour_pacakage.tour_categories_id inner join  tour_tags on tour_tags.tour_tags_id=tour_pacakage.tour_tags_id';
    selectQuery += ` where tour_pacakage_id ='${req.params.id}'`;
    console.log(selectQuery);
   
    try{
        var getData = await db.pool.query(selectQuery);  
        if(getData.rows.length>0){ 

        const gallery=    await getTourPacageGallery(req.params.id);
        console.log(gallery);
        var response=getData.rows[0] ;
        response.gallery = gallery; 
       
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                image_path :  req.protocol+'://'+req.headers.host+'/tours/', 
                data:response 
            });    
        }else{
            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'Records not found', 
                
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


var getTourPacageGallery = async (tour_pacakage_id) => { 
    
    selectQuery = 'select * from tour_pacakage_images ';
    selectQuery += ` where tour_pacakage_id ='${tour_pacakage_id}'`;
    console.log(selectQuery);

    try{
        var getData = await db.pool.query(selectQuery);  

        return getData.rows;
        
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


//Get tours in categorized manner


module.exports.getCategorizedTour=async (req, res) => {


    try{
        console.log(req.body)
        const tags=    await getTourTags();

            console.log(tags);

            //var response = {};

            var response=new Array();

            //The object holding all your dynamic variables
           


            //Create dynamic variables (object properties)

            if(tags.length>0)
            {
                
                var tour = {};
                for (let index = 0; index < tags.length; index++) {
                    
                    
                    //tour[tags[index].tag_name]
                   // tour = await getTourByTag(tags[index].tour_tags_id,req.body.tour_categories_id);
                   // response.tours = tour;
                   var tag_data={};
                   tag_data.tour_tags_id=tags[index].tour_tags_id;
                   tag_data.tag_name=tags[index].tag_name;
                   tag_data.tourdata=await getTourByTag(tags[index].tour_tags_id,req.body.tour_categories_id);;
                   response.push(tag_data);
                 
                    
                }

                res.status(200).json({   
                    status: statusConfig.successMessage.status,
                    message: 'Records are found',
                    image_path :  req.protocol+'://'+req.headers.host+'/tours/', 
                    data:response 
                }); 
            }else{
                res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'Records not found', 
                
            });
            }
           
           
            //MyVarObj[myVar1].push("1");
          
            
          //  console.log("MyVarObj "+JSON.stringify(response));  

    }catch (err) {
        console.log(err);
        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });

    }
}


var getTourByTag=async(tag_id,cat_id)=>
{
    selectQuery = 'select * from tour_pacakage  inner join tour_categories on tour_categories.tour_categories_id=tour_pacakage.tour_categories_id inner join  tour_tags on tour_tags.tour_tags_id=tour_pacakage.tour_tags_id';
    console.log("getTourByTag "+tag_id);

    //if(typeof tag_id !== 'undefined' && tag_id.length>0){
        selectQuery += ` where tour_pacakage.tour_tags_id ='${tag_id}'`;
    //} 

    if(typeof cat_id !== 'undefined' && cat_id.length>0){
        selectQuery += ` and tour_pacakage.tour_categories_id ='${cat_id}'`;
    } 

    selectQuery += ` ORDER BY tour_pacakage_id desc  `;  
    selectQuery += ` LIMIT 8  `;  
   // console.log(selectQuery);

    try{
        var getData = await db.pool.query(selectQuery);  

        return getData.rows;
        
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





//get Tour  Tags
module.exports.getTourTags = async (req, res) => {

    const tags=    await getTourTags();
     

    try{
        
        if(tags.length>0)
        {
            
       
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Records are found',
                image_path :  req.protocol+'://'+req.headers.host+'/tours/', 
                data:tags 
            });
        }else{

            res.status(statusConfig.status.notfound)  
            .json({ 
                status: statusConfig.successMessage.status,
                message: 'Records not found', 
                
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


var getTourTags=async()=>
{
    
    

    

    try{
        var getData = await db.pool.query("select * from tour_tags order by tour_tags_id desc")

        return getData.rows;
        
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

