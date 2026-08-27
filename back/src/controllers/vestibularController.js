const dayjs = require('dayjs');

const VestibularModel = require('../models/vestibularModel')

function formatarVestibular(vestibular) {
    return {
        ...vestibular,

        data_inicio_inscricao: vestibular.data_inicio_inscricao
            ? dayjs(vestibular.data_inicio_inscricao).format('YYYY-MM-DD')
            : null,

        data_fim_inscricao: vestibular.data_fim_inscricao
            ? dayjs(vestibular.data_fim_inscricao).format('YYYY-MM-DD')
            : null,

        data_prova: vestibular.data_prova
            ? dayjs(vestibular.data_prova).format('YYYY-MM-DD')
            : null,

        taxa_prova: vestibular.taxa_prova
            ? Number(vestibular.taxa_prova)
            : null
    }
}

const VestibularController = {

    async listar(req, res) {
        try {
            const dados = await VestibularModel.mostrarVestibular()
            const vestibularesFormatados = dados.map(formatarVestibular)

            res.json(vestibularesFormatados)
        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: 'Erro ao listar vestibulares' })
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params
            const dados = await VestibularModel.buscarPorId(id)

            if (!dados) {
                return res.status(404).json({
                    mensagem: 'Vestibular não encontrado'
                })
            }

            res.json(formatarVestibular(dados))
        } catch (error) {
            console.log(error)

            res.status(500).json({
                erro: 'Erro ao buscar vestibular'
            })
        }
    },

    async cadastrar(req, res) {
        try {
            const { vestibular, dt_inicio, dt_fim, dt_prova, taxa, link } = req.body

            if (!vestibular || !dt_inicio || !dt_fim || !dt_prova || !taxa) {
                return res.status(400).json({ mensagem: 'Campos obrigatórios' })
            }

            const inicio = dayjs(dt_inicio);
            const fim = dayjs(dt_fim);
            const prova = dayjs(dt_prova);

            if (fim.isBefore(inicio)) {
                return res.status(400).json({
                    mensagem: "A data final das inscrições deve ser posterior à inicial."
                });
            }

            if (prova.isBefore(fim) || prova.isSame(fim, 'day')) {
                return res.status(400).json({
                    mensagem: "A prova deve ocorrer após o encerramento das inscrições."
                });
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

            const inicio = dayjs(dt_inicio);
            const fim = dayjs(dt_fim);
            const prova = dayjs(dt_prova);

            if (fim.isBefore(inicio)) {
                return res.status(400).json({
                    mensagem: "A data final das inscrições deve ser posterior à inicial."
                });
            }

            if (prova.isBefore(fim) || prova.isSame(fim, 'day')) {
                return res.status(400).json({
                    mensagem: "A prova deve ocorrer após o encerramento das inscrições."
                });
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