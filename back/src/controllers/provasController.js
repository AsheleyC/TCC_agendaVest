const ProvasModel = require('../models/provasModel')

const ProvasController = {

    async listar(req, res) {
        try {
            const dados = await ProvasModel.listar()
            res.status(200).json(dados)
        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    },

    async inserir(req, res) {
        try {
            const { id_vestibular, link_prova, link_gabarito, ano_prova } = req.body

            if (!id_vestibular || !link_prova || !link_gabarito || !ano_prova) {
                return res.status(400).json({
                    resposta: "Preencha todos os campos obrigatórios"
                })
            }

            const anoAtual = new Date().getFullYear()

            if (ano_prova > anoAtual) {
                return res.status(400).json({
                    resposta: `O ano da prova não pode ser posterior a ${anoAtual}`
                })
            }

            await ProvasModel.inserir(
                id_vestibular,
                link_prova,
                link_gabarito,
                ano_prova
            )

            res.status(201).json({
                resposta: "Prova inserida com sucesso"
            })

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
        }
    },

    async atualizar(req, res) {
        try {
            const { id_prova } = req.params
            const { id_vestibular, link_prova, link_gabarito, ano_prova } = req.body

            if (!id_vestibular || !link_prova || !link_gabarito || !ano_prova) {
                return res.status(400).json({
                    resposta: "Preencha os campos obrigatórios"
                })
            }

            const anoAtual = new Date().getFullYear()

            if (ano_prova > anoAtual) {
                return res.status(400).json({
                    resposta: `O ano da prova não pode ser posterior a ${anoAtual}`
                })
            }

            const existente = await ProvasModel.buscarPorId(id_prova)

            if (!existente) {
                return res.status(404).json({
                    resposta: "Registro não encontrado"
                })
            }

            await ProvasModel.atualizar(
                id_prova,
                id_vestibular,
                link_prova,
                link_gabarito,
                ano_prova
            )

            res.status(200).json({
                resposta: "Prova atualizada com sucesso"
            })

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
        }
    },

    async deletar(req, res) {
        try {
            const { id_prova } = req.params

            const existente = await ProvasModel.buscarPorId(id_prova)

            if (!existente) {
                return res.status(404).json({ resposta: "Registro não encontrado" })
            }

            await ProvasModel.deletar(id_prova)

            res.status(200).json({ resposta: "Prova deletada com sucesso" })

        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    }
}

module.exports = ProvasController