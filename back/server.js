const express = require('express')
const server = express()
const cors = require('cors')
const mysql = require('mysql2/promise')
const crypto = require('crypto')
const pool = require('./db')

const swaggerui = require('swagger-ui-express') 
const swaggerdocument = require('./swagger.json') 
server.use('/api-docs', swaggerui.serve,swaggerui.setup(swaggerdocument)) 

require('dotenv').config()

const porta = process.env.porta

server.use(express.json())
server.use(cors())

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})

// Visualizar Perfil
server.get('/ver_perfil', async (req, res) => {
    try {
        const {id_usuario} = req.query
        const sql = `select nome_usuario, email, foto_perfil from usuarios where id_usuario = ?`
        const [resultado] = await pool.query(sql, [id_usuario])
        res.json({ "resposta": resultado })
    } catch (error) {
        console.log(error)
    }
})

// Cadastrar Usuário
server.post('/cadastro', async (req, res) => {
    try {
        const { nome_usuario, email, foto_perfil } = req.body
        let { senha } = req.body

        senha = senha.trim()

        if (senha == "") {
            return res.json({ "resposta": "Preencha o campo" })
        } else if (senha.length < 6) {
            return res.json({ "resposta": "A senha deve conter no mínimo 6 caracteres" })
        } else if (email.length < 6) {
            return res.json({ "resposta": "Preencha o campo e-mail coretamente" })
        } else if (nome_usuario.length < 6) {
            return res.send({ "resposta": "Preencha o campo nome corretamente" })
        }

        let sql = `select * from usuarios where email = ?`
        let [resultado_email] = await pool.query(sql, [email])
        if (resultado_email.length != 0) {
            return res.json({ "resposta": "E-mail já cadastrado" })
        }

        const hash = crypto.createHash("sha256").update(senha).digest("hex")

        sql = `insert into usuarios (nome_usuario, email, senha, foto_perfil) values (?, ?, ?, ?)`
        let resultado = await pool.query(sql, [nome_usuario, email, hash, foto_perfil])


        // FUNCIONANDO AO CONTRÁRIO (VERIFICAR DEPOIS)
        if (resultado.affectedRows > 0) {
            return res.json({ "resposta": "Erro no cadastro" })
            return res.json({ "resposta": "Erro no cadastro" })
        } else {
            return res.json({ "resposta": "Cadastro realizado" })
        }
    } catch (error) {
        console.log(error)
    }
})

// LOGIN
server.post("/login", async (req,res) =>{
    try {
        const {email} = req.body
        let {senha} = req.body

        senha = senha.trim()

        if(senha == ""){
            return res.send("Preencha o campo") 
        }else if(senha.length < 6){
            return res.send("A senha deve conter no mínimo 6 caracteres")
        }

        const hash = crypto.createHash("sha256").update(senha).digest("hex")

        const sql = `select * from usuarios where email = ? and senha = ?`
        const [resultado] = await pool.query(sql, [email, hash])
        
        if(resultado.length > 0){
            res.send("Login realizado com sucesso")
        }else{
            res.send("Usuário ou senha inválido")
        }
    } catch (error) {
        console.log(error)
    }
})

// Atualizar nome
server.put('/atualizar_nomeUsuario', async (req, res) => {
    try {
        const { nome_usuario, email } = req.body

        let sql = 'SELECT * FROM usuarios WHERE email = ?'
        let [resultado_email] = await pool.query(sql, [email])
        if (resultado_email.length == 0) {
            return res.json({ "resposta": "E-mail Inexistente" })
        }

        sql = `UPDATE usuarios SET nome_usuario = ? WHERE email = ?`

        const [resultado] = await pool.query(sql, [nome_usuario, email])

        res.json({
            "resultado": resultado,
            "mensagem": `Nome de usuário Atualizado para: ${nome_usuario}`
        })

    } catch (error) {
        console.log(error)
    }
})

// Atualizar email
server.put('/atualizar_emailUsuario', async (req, res) => {
    try {
        const { email_antigo, email_novo } = req.body

        let sql = 'SELECT * FROM usuarios WHERE email = ?'
        let [resultado_email] = await pool.query(sql, [email_antigo ])
        if (resultado_email.length == 0) {
            return res.json({ "resposta": "E-mail Inexistente" })
        }

        sql = `UPDATE usuarios SET email = ? WHERE email = ?`

        const [resultado] = await pool.query(sql, [email_novo, email_antigo])

        res.json({
            "resultado": resultado,
            "mensagem": `Email do usuário Atualizado para: ${email_novo}`
        })

    } catch (error) {
        console.log(error)
    }
})

//Deletar usuário
server.delete('/deletar_usuario', async (req, res) => {
    try {
        const { senha, email } = req.body
        const sql = 'DELETE FROM usuarios WHERE email = ? AND senha = ?'
        const hash = crypto.createHash("sha256").update(senha).digest("hex")


        const [resultado] = await pool.query(sql, [email, hash])

        res.json({
            "resultado": resultado,
            "mensagem": `Usuário Deletado`
        })

    } catch (error) {
        console.log(error)
    }
})
