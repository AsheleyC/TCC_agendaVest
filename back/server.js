const express = require('express')  
const server = express()  
const cors = require('cors')  
const mysql = require('mysql2/promise') 
const crypto = require('crypto')  
const pool = require('./db') 

require('dotenv').config() 

const porta = process.env.porta 

server.use(express.json())  
server.use(cors())  

server.listen(porta,()=>{  
    console.log(`Servidor rodando em: http://localhost:${porta}`)  
}) 

server.get('/', async (req,res)=>{
    
})

//bia
//dfjnasojfnboudanofj































//Asheley
