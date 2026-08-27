const InscricaoModel = require('../models/inscricaoModel')

const InscricaoController = {

    async adicionar(req, res) {

        try {

            const { id_usuario, id_vestibular, notificar_inscricao } = req.body

            if (!id_usuario || !id_vestibular) {
                return res.status(400).json({
                    mensagem: 'id_usuario e id_vestibular são obrigatórios'
                })
            }

            const jaExiste = await InscricaoModel.verificarInscricao(
                id_usuario, id_vestibular
            )

            if (jaExiste) {
                return res.status(409).json({
                    mensagem: 'Você já adicionou este vestibular à sua agenda'
                })
            }

            const valorNotificar = notificar_inscricao ? 1 : 0

            await InscricaoModel.adicionarInscricao(
                id_usuario, id_vestibular, valorNotificar
            )

            res.status(201).json({ mensagem: 'Vestibular adicionado à agenda' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao adicionar inscrição' })
        }

    },

    async listarPorUsuario(req, res) {

        try {

            const { id_usuario } = req.params

            const dados = await InscricaoModel.listarPorUsuario(id_usuario)

            res.status(200).json(dados)

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao listar inscrições' })
        }

    },

    async deletar(req, res) {

        try {

            const { id } = req.params

            const existente = await InscricaoModel.buscarPorId(id)

            if (!existente) {
                return res.status(404).json({ mensagem: 'Inscrição não encontrada' })
            }

            await InscricaoModel.deletar(id)

            res.status(200).json({ mensagem: 'Removido da agenda com sucesso' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao deletar inscrição' })
        }

    }

}

module.exports = InscricaoController