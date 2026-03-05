const myslq = require('mysql2/promise')  
require('dotenv').config(); 

const pool = myslq.createPool({  
    host: process.env.host,
    user: process.env.user,  
    password: process.env.password,  
    port: process.env.port,  
    database: process.env.database,  
})  

module.exports = pool 