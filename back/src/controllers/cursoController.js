const CursosModel = require('../models/CursosModel')

const CursosController = {

    async listar(req, res) {
        try {
            const dados = await CursosModel.listar()
            res.status(200).json(dados)
        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    },

    async inserir(req, res) {
        try {
            const { id_universidade, curso, nota_corte } = req.body

            if (!id_universidade || !curso || nota_corte == null) {
                return res.status(400).json({
                    resposta: "Preencha todos os campos"
                })
            }

            await CursosModel.inserir(id_universidade, curso, nota_corte)

            res.status(201).json({ resposta: "Curso inserido com sucesso" })

        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    },

    async atualizar(req, res) {
        try {
            const { id_curso } = req.params
            const { id_universidade, curso, nota_corte } = req.body

            if (!id_universidade || !curso || nota_corte == null) {
                return res.status(400).json({
                    resposta: "Preencha todos os campos"
                })
            }

            const existente = await CursosModel.buscarPorId(id_curso)

            if (!existente) {
                return res.status(404).json({
                    resposta: "Registro não encontrado"
                })
            }

            await CursosModel.atualizar(
                id_curso, id_universidade, curso, nota_corte
            )

            res.status(200).json({
                resposta: "Curso atualizado com sucesso"
            })

        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    },

    async deletar(req, res) {
        try {
            const { id_curso } = req.params

            const existente = await CursosModel.buscarPorId(id_curso)

            if (!existente) {
                return res.status(404).json({
                    resposta: "Registro não encontrado"
                })
            }

            await CursosModel.deletar(id_curso)

            res.status(200).json({
                resposta: "Curso deletado com sucesso"
            })

        } catch (error) {
            res.status(500).json({ resposta: error.message })
        }
    }
}

module.exports = CursosController