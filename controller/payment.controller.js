const db = require('../models');
const statusConfig = require('../helpers/status');
const common = require('../helpers/common');
const { check, validationResult } = require('express-validator');
var config = require('../config');
const multer = require('multer');
const stripe = require('stripe')('sk_test_51He2PDEV6u1WX6bbo6pSc3pVYcuPM1CFiawBXytulIzCjwC8CF0hgSU95RnypfY7LM9iopT9mFOgOZmylBmlf6Nk00hCNyRBvP');


module.exports.ephemeralKeys =async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }
    const userId = req.userId;
    const data = req.body;
    console.log (data);

    try{
        var selectQuery = `select customer_id,email from users where user_id = '${userId}'`;
        var getData = await db.pool.query(selectQuery);
        
        var key;
       // console.log(getData.rows[0].customer_id);
      //  console.log(getData.rows[0].customer_id.length);
        if(getData.rows[0].customer_id!=null && getData.rows[0].customer_id.length>0)
        {
            console.log("if");
            key = await stripe.ephemeralKeys.create(
                {customer: getData.rows[0].customer_id},
                {apiVersion: data.apiVersion}
                );
               
        }else{
            console.log("else");
            const customer = await stripe.customers.create({
                email: getData.rows[0].email,
              });
              console.log(customer.id);
              
           var   updateQuery = 'update users set ';
    
              if(typeof customer.id !== 'undefined' && customer.id.length>0){
                  updateQuery += ` customer_id ='${customer.id}'`; 
              }
              updateQuery += ` where user_id = '${userId}'`; 
              console.log(updateQuery);  
              await db.pool.query(updateQuery); 
               key = await stripe.ephemeralKeys.create(
                {customer: customer.id},
                {apiVersion: data.apiVersion}
                );
                
        }

        res.status(statusConfig.status.success)
        .json({  
            key 
        });
    
           
            
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

module.exports.makePayment=async (req, res) => {

    try{

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status, errors: errors.array() });
        } 

        var data = req.body; var insertQuery ='';
        var set = []; var value = [];
       
        if(typeof data.tour_pacakage_name !== 'undefined' && data.tour_pacakage_name.length>0){
            set.push('user_id');
            value.push(`'${data.user_id}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"user_id is required" });
        }

        if(typeof data.package_id !== 'undefined' && data.package_id.length>0){
            set.push('package_id');
            value.push(`'${data.package_id}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"package_id is required" });
        }

        if(typeof data.bill_amount_paid !== 'undefined' && data.bill_amount_paid.length>0){
            set.push('bill_amount_paid');
            value.push(`'${data.bill_amount_paid}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"bill_amount_paid is required" });
        }

        if(typeof data.payament_ref_id !== 'undefined' && data.payament_ref_id.length>0){
            set.push('payament_ref_id');
            value.push(`'${data.payament_ref_id}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"payament_ref_id is required" });
        }


        if(typeof data.payament_ref_id !== 'undefined' && data.payament_ref_id.length>0){
            set.push('payament_ref_id');
            value.push(`'${data.payament_ref_id}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"payament_ref_id is required" });
        }

        if(typeof data.pacakage_type !== 'undefined' && data.pacakage_type.length>0){
            set.push('pacakage_type');
            value.push(`'${data.pacakage_type}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"pacakage_type is required" });
        }

        if(typeof data.payment_mode !== 'undefined' && data.payment_mode.length>0){
            set.push('payment_mode');
            value.push(`'${data.payment_mode}'`); 
        } else{
            return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"payment_mode is required" });
        }

        var insertQuery = `INSERT INTO billing_histories(${set.join(',')}) values(${value.join(',')}) RETURNING *`;
        console.log(insertQuery);

        try{
            var response = {}; 
        var getData = await db.pool.query(insertQuery);
        
        response =  getData.rows[0];

        if(response!=null)
        {
            res.status(200).json({   
                status: statusConfig.successMessage.status,
                message: 'Tour has been added successfully!',  
              
                data:response  
            });
            
            } 

        
        }catch (err) {
                
        }

    }catch (err) {

    }

}


module.exports.getPaymentIntent =async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      
        return res.status(statusConfig.status.unprocessable).json({status: statusConfig.errorMessage.status,message:"Values cannot be blank. Please check request parameter",errors: errors.array() });
    }
    try{

        const data = req.body;

        const price=parseFloat(req.body.price)*100;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'EUR',
            customer:data.customer_id,
            
            
            });
            const clientSecret = paymentIntent.client_secret

            console.log(paymentIntent);
                res.status(statusConfig.status.success)
            .json({  
                clientSecret 
            });
    }catch (err) {

        res.status(statusConfig.status.error)
        .json({ 
            status: statusConfig.errorMessage.status,
            data: err,
            message: statusConfig.errorMessage.something_went
        });
    }

    
    
}