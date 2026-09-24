const InscricoesModel = require('../models/inscricoesModel')

const InscricoesController = {
    async adicionar(req, res) {
        try {
            const {
                id_usuario,
                id_vestibular
            } = req.body

            if (!id_usuario || !id_vestibular) {
                return res.status(400).json({
                    mensagem: 'id_usuario e id_vestibular são obrigatórios'
                })
            }

            const jaExiste = await InscricoesModel.verificarInscricao(
                id_usuario,
                id_vestibular
            )

            if (jaExiste) {
                return res.status(409).json({
                    mensagem: 'Você já adicionou este vestibular à sua agenda'
                })
            }

            await InscricoesModel.adicionarInscricao(
                id_usuario,
                id_vestibular
            )

            res.status(201).json({
                mensagem: 'Vestibular adicionado à agenda'
            })
        } catch (error) {
            res.status(500).json({
                erro: 'Erro ao adicionar inscrição'
            })
        }
    },

    async listarPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params

            const dados = await InscricoesModel.listarPorUsuario(id_usuario)
            res.status(200).json(dados)
        } catch (error) {
            res.status(500).json({
                erro: 'Erro ao listar inscrições'
            })
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params
            const existente = await InscricoesModel.buscarPorId(id)

            if (!existente) {
                return res.status(404).json({
                    mensagem: 'Inscrição não encontrada'
                })
            }

            await InscricoesModel.deletar(id)

            res.status(200).json({
                mensagem: 'Removido da agenda com sucesso'
            })
        } catch (error) {
            res.status(500).json({
                erro: 'Erro ao deletar inscrição'
            })
        }
    }
}

module.exports = InscricoesController