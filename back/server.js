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

// Visualizar Perfil
server.get('/ver_perfil', async (req,res) =>{
    try {
        const [resultado] = await pool.query(`select nome_usuario, email, senha, foto_perfil from usuarios`)
        res.json({"resposta":resultado})
    } catch (error) {
        console.log(error)
    }    
})

// Cadastrar Usuário
server.post('/cadastro', async (req,res) =>{
    try {
        const {nome_usuario, email, foto_perfil} = req.body
        let {senha} = req.body

        senha = senha.trim()

        if(senha == ""){
            return res.json({"resposta":"Preencha o campo"})
        }else if(senha.length < 6){
            return res.json({"resposta":"A senha deve conter no mínimo 6 caracteres"})
        }else if(email.length < 6){
            return res.json({"resposta":"Preencha o campo e-mail coretamente"})
        }else if(nome_usuario.length < 6){
            return res.send({"resposta":"Preencha o campo nome corretamente"})
        }

        let sql = `select * from usuarios where email = ?`
        let [resultado_email] = await pool.query(sql,[email])
        if(resultado_email.length != 0){
            return res.json({"resposta":"E-mail já cadastrado"})
        }

        const hash = crypto.createHash("sha256").update(senha).digest("hex")

        sql = `insert into usuarios (nome_usuario, email, senha, foto_perfil) values (?, ?, ?, ?)`
        let resultado = await pool.query(sql, [nome_usuario, email, hash, foto_perfil])

        console.log(resultado)

        // FUNCIONANDO AO CONTRÁRIO (VERIFICAR DEPOIS)
        if(resultado.affectedRows >0){
            return res.json({"resposta":"Cadastro realizado"})
        }else{
            return res.json({"resposta":"Erro no cadastro", "res,kldmf": resultado
            })
        }
    } catch (error) {
        console.log(error)
    }    
})
