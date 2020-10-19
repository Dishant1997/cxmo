require('dotenv').config(); 
const envirement = process.env.NODE_ENV
const dbConfig = require("../config/db.config");
const pg  = require('pg');
// const pool = new Pool({
//     host:dbConfig.HOST,
//     user:dbConfig.USER,
//     password:dbConfig.PASSWORD,
//     database:dbConfig.DB,
//     port:'5432'

 

const cs = `postgres://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;


const client = new pg.Client(cs);
 
client.connect();
const db = {};
db.pool = client;  
// pool.on('connect', () => { 
//     console.log('connected to the db');
// }); 
module.exports = db;    