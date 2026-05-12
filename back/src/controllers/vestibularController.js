const VestibularModel = require('../models/vestibularModel')

const VestibularController = {

    async listar(req, res) {
        try {
            const dados = await VestibularModel.mostrarVestibular()
            res.json(dados)
        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao listar vestibulares' })
        }
    },

    async cadastrar(req, res) {
        try {
            const { vestibular, dt_inicio, dt_fim, dt_prova, taxa, link } = req.body

            if (!vestibular || !dt_inicio || !dt_fim || !dt_prova) {
                return res.status(400).json({ mensagem: 'Campos obrigatórios' })
            }

            await VestibularModel.addVestibular(
                vestibular, dt_inicio, dt_fim, dt_prova, taxa, link
            )

            res.status(201).json({ mensagem: 'Vestibular cadastrado' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao cadastrar' })
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const { vestibular, dt_inicio, dt_fim, dt_prova, taxa, link } = req.body

            const existente = await VestibularModel.buscarPorId(id)

            if (!existente) {
                return res.status(404).json({ mensagem: 'Não encontrado' })
            }

            await VestibularModel.atualizar(
                id, vestibular, dt_inicio, dt_fim, dt_prova, taxa, link
            )

            res.json({ mensagem: 'Atualizado com sucesso' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao atualizar' })
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params

            const existente = await VestibularModel.buscarPorId(id)

            if (!existente) {
                return res.status(404).json({ mensagem: 'Não encontrado' })
            }

            await VestibularModel.deletar(id)

            res.json({ mensagem: 'Deletado com sucesso' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao deletar' })
        }
    }
}

module.exports = VestibularController