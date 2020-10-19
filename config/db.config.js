
require('dotenv').config(); 
const envirement = process.env.NODE_ENV
 
switch (envirement) {  
    case 'production': 
    database  = {
         HOST:"aa1v63mkw7p9bix.ckscc7hap6ar.eu-central-1.rds.amazonaws.com",
         USER:"AARCHIK",
         PASSWORD:"063c255764",
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

