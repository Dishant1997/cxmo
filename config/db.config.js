
require('dotenv').config(); 
const envirement = process.env.NODE_ENV
 
switch (envirement) {  
    case 'production': 
    database  = {
         HOST:"ec2-34-254-24-116.eu-west-1.compute.amazonaws.com",
         USER:"yazqucvbcqvtsh",
         PASSWORD:"7bc8276e586b1673e58617d36eda7b0024871b8922c24616e94eba14a29a36a9",
         DB:"dblfn31njeb5kp",
         dialect:"postgres",
         PORT:"5432",
         pool:{
             max:5,
             min:0,
             acquire:30000,
             idele:10000
         }
    };
    break;
    case 'testing':
    database  = {
        HOST:"localhost",
        USER:"postgres",
        PASSWORD:"123456",
        DB:"cxmo",
        dialect:"postgres",
        PORT:"5432",
        pool:{
            max:5,
            min:0,
            acquire:30000,
            idele:10000
        }  
    };
    break;
 } 
 module.exports = database;

