const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admModel = require('../models/admModel.js')

const admController = {

    async cadastrar(req, res) {
        try {
            let { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({ mensagem: "Preencha todos os campos" })
            }

            senha = senha.trim()

            const hash = await bcrypt.hash(senha, 10)

            await admModel.criarAdm(email, hash)

            return res.status(201).json({ mensagem: "ADM cadastrado com sucesso" })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ erro: "Erro ao cadastrar ADM" })
        }
    },

    async login(req, res) {
        try {
            let { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({ mensagem: "Preencha todos os campos" })
            }

            senha = senha.trim()

            const adm = await admModel.buscarPorEmail(email)

            if (!adm) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" })
            }

            const validou = await bcrypt.compare(senha, adm.senha)

            if (!validou) {
                return res.status(401).json({ mensagem: "Senha incorreta" })
            }

            return res.json({ mensagem: "Login realizado com sucesso" })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ erro: "Erro no login" })
        }
    }
}

module.exports = admController