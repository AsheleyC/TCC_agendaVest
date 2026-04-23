const express = require('express')
const server = express()
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const pool = require('./db')
const jwt = require('jsonwebtoken')


const swaggerui = require('swagger-ui-express')
const swaggerdocument = require('./swagger.json')
server.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerdocument))

require('dotenv').config()

const porta = process.env.porta

server.use(express.json())

server.use(cors())

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})

function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    jwt.verify(token, "SUA_API_KEY", (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }
        req.user = user; // dados do token
        next();
    });
}

// Visualizar Perfil
server.get('/ver_perfil', async (req, res) => {
    try {
        const { id_usuario } = req.query
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
            return res.json({ "resposta": "Preencha o campo Senha", "status": "false" })
        } else if (senha.length < 6) {
            return res.json({ "resposta": "A senha deve conter no mínimo 6 caracteres", "status": "false" })
        } else if (email.length < 6) {
            return res.json({ "resposta": "Preencha o campo e-mail coretamente", "status": "false" })
        } else if (nome_usuario.length < 6) {
            return res.json({ "resposta": "Preencha o campo nome corretamente", "status": "false" })
        } else if (email.length < 6) {
            return res.json({ "resposta": "Preencha o campo email corretamente", "status": "false" })
        }

        let sql = `select * from usuarios where email = ?`
        let [resultado_email] = await pool.execute(sql, [email])
        if (resultado_email.length != 0) {
            return res.json({ "resposta": "E-mail já cadastrado", "status": "false" })
        }

        const hash = await bcrypt.hash(senha, 10)

        sql = `insert into usuarios (nome_usuario, email, senha, foto_perfil) values (?, ?, ?, ?)`
        let [resultado] = await pool.execute(sql, [nome_usuario, email, hash, foto_perfil])

        // FUNCIONANDO AO CONTRÁRIO (VERIFICAR DEPOIS)
        if (resultado.affectedRows > 0) {
            return res.json({ resposta: "Cadastro realizado", status: "true" })
        } else {
            return res.json({ resposta: "Erro no cadastro", status: "false" })
        }
    } catch (error) {
        console.log(error)
    }
})

// LOGIN
server.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body

        let sql = `SELECT email FROM usuarios WHERE email = ? `
        const [resultado] = await pool.execute(sql, [email])

        if (resultado.length > 0) {

            sql = `SELECT email, senha FROM usuarios WHERE email = ?`
            const [resultado2] = await pool.execute(sql, [email])

            const validou = await bcrypt.compare(senha, resultado2[0].senha)

            if (validou == false) {
                return res.json({ "status": "false", "mensagem": "Email ou senha inválidos!!" })
            } else {
                const token = jwt.sign(
                    {
                        email: email
                    },
                    api_key,
                    {
                        expiresIn: "1h"
                    }
                )

                res.json({ "status": "true", "mensagem": "Acesso liberado", "token": token })
            }
        }
        else {
            return res.json({ "status": 'false', "mensagem": "Email ou senha inválidos!!" })
        }
    } catch (error) {
        console.log(error)
    }
})

// Atualizar nome
server.put('/atualizar_nomeUsuario', autenticarToken, async (req, res) => {
    try {
        const { nome_usuario, email } = req.body

        let sql = 'SELECT * FROM usuarios WHERE email = ?'
        let [resultado_email] = await pool.query(sql, [email])
        if (resultado_email.length == 0) {
            return res.json({ "mensagem": "E-mail Inexistente", "status": "false" })
        }


        sql = `UPDATE usuarios SET nome_usuario = ? WHERE email = ?`

        const [resultado] = await pool.query(sql, [nome_usuario, email])

        res.json({
            "resultado": resultado,
            "mensagem": `Nome de usuário Atualizado para: ${nome_usuario}`,
            "status": "true"
        })

    } catch (error) {
        console.log(error)
    }
})

// Atualizar email
server.put('/atualizar_emailUsuario', autenticarToken, async (req, res) => {
    try {
        const { email_antigo, email_novo } = req.body

        let sql = 'SELECT * FROM usuarios WHERE email = ?'
        let [resultado_email] = await pool.query(sql, [email_antigo])
        if (resultado_email.length == 0) {
            return res.json({ "mensagem": "E-mail Inexistente", "status": "false" })
        }

        sql = `UPDATE usuarios SET email = ? WHERE email = ?`

        const [resultado] = await pool.query(sql, [email_novo, email_antigo])

        res.json({
            "resultado": resultado,
            "mensagem": `Email do usuário Atualizado para: ${email_novo}`,
            "status": "true"
        })

    } catch (error) {
        console.log(error)
    }
})

//atualizar Senha
server.post('/atualizarSenha', autenticarToken, async (req, res) => {
    try {
        const { email, senha_nova } = req.body

        let sql = 'SELECT * FROM usuarios WHERE email = ?'
        let [resultado_email] = await pool.query(sql, [email_antigo])
        if (resultado_email.length == 0) {
            return res.json({ "mensagem": "E-mail Inexistente", "status": "false" })
        }

        const hash = await bcrypt.hash(senha_nova, 10)

        sql = `UPDATE usuarios SET senha = ? WHERE email = ?`

        const [resultado] = await pool.query(sql, [hash, email])

        res.json({
            "resultado": resultado,
            "mensagem": `Senha Atualizada com Sucesso`,
            "status": "true"
        })


    } catch (error) {
        console.log(error)
    }
})

//Deletar usuário
server.delete('/deletar_usuario', autenticarToken, async (req, res) => {
    try {
        const { senha, email } = req.body
        const sql = 'DELETE FROM usuarios WHERE email = ? AND senha = ?'
        const hash = crypto.createHash("sha256").update(senha).digest("hex")


        const [resultado] = await pool.query(sql, [email, hash])

        res.json({
            "resultado": resultado,
            "mensagem": `Usuário Deletado`,
            "status": "true"
        })

    } catch (error) {
        console.log(error)
    }
})
