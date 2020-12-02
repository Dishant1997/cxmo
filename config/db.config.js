
require('dotenv').config(); 
const envirement = process.env.NODE_ENV
 
switch (envirement) {  
    case 'production': 
    database  = {
        HOST:"95.217.162.31",
        USER:"postgres",
        PASSWORD:"Cxmo@2020",
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

