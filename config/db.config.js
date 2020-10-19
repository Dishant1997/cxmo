
require('dotenv').config(); 
//const envirement = process.env.NODE_ENV
 
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
   
 module.exports = database;

