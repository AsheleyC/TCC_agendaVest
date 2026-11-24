const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admModel = require('../models/admModel.js')

const admController = {

    async cadastrar(req, res) {
        try {
            let { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({
                    mensagem: "Preencha todos os campos"
                })
            }

            email = email.trim()
            senha = senha.trim()

            const admExistente =
                await admModel.buscarPorEmail(email)

            if (admExistente) {
                return res.status(409).json({
                    mensagem: "Já existe um ADM com esse e-mail"
                })
            }

            const hash =
                await bcrypt.hash(
                    senha,
                    10
                )

            await admModel.criarAdm(
                email,
                hash
            )

            return res.status(201).json({
                mensagem: "ADM cadastrado com sucesso"
            })

        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao cadastrar ADM",
                detalhe: error.message
            })
        }
    },

    async login(req, res) {
        try {
            let { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({
                    mensagem: "Preencha todos os campos"
                })
            }

            email = email.trim()
            senha = senha.trim()

            const adm =
                await admModel.buscarPorEmail(email)

            if (!adm) {
                return res.status(401).json({
                    mensagem: "E-mail ou senha incorretos"
                })
            }

            const validou =
                await bcrypt.compare(
                    senha,
                    adm.senha
                )

            if (!validou) {
                return res.status(401).json({
                    mensagem: "E-mail ou senha incorretos"
                })
            }

            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    erro: "JWT_SECRET não foi carregado"
                })
            }

            const token =
                jwt.sign(
                    {
                        id_adm: adm.id,
                        email: adm.email,
                        tipo: 'adm'
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '8h'
                    }
                )

            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                token
            })

        } catch (error) {
            return res.status(500).json({
                erro: "Erro no login",
                detalhe: error.message
            })
        }
    },

    async validar(req, res) {
        return res.status(200).json({
            mensagem: "ADM autenticado",
            adm: req.adm
        })
    }
}

module.exports = admController