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

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})

// Atualizar nome
server.put('/atualizar_nomeUsuario', async (req, res) => {
    try {
        const { nome_usuario, email } = req.body

        const sql = `UPDATE usuarios SET nome_usuario = ? WHERE email = ?`
        const [resultado] = await pool.query(sql, [nome_usuario, email])

        res.json({
            "resultado": resultado,
            "mensagem": `Nome de usuário Atualizado para: ${nome_usuario}`
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

        const [resultado] = await pool.query(sql, [email, senha])

        res.json({
            "resultado": resultado,
            "mensagem": `Usuário Deletado`
        })

    } catch (error) {
        console.log(error)
    }
})