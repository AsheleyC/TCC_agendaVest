const CursosModel = require('../models/cursoModel')

const CursoController = {

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

            // Campos obrigatórios
            if (!id_universidade || !curso || nota_corte == null) {
                return res.status(400).json({
                    resposta: "Preencha todos os campos"
                })
            }

            // Nome do curso
            if (!/^[A-Za-zÀ-ÿ\s]+$/.test(curso)) {
                return res.status(400).json({
                    resposta: "O nome do curso deve conter apenas letras"
                })
            }

            // Nota de corte
            if (nota_corte < 0) {
                return res.status(400).json({
                    resposta: "A nota de corte deve ser maior ou igual a zero"
                })
            }

            await CursosModel.inserir(
                id_universidade,
                curso,
                nota_corte
            )

            res.status(201).json({
                resposta: "Curso inserido com sucesso"
            })

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
        }
    },

    async atualizar(req, res) {
        try {
            const { id_curso } = req.params
            const { id_universidade, curso, nota_corte } = req.body

            // Verifica se todos os campos foram preenchidos
            if (!id_universidade || !curso || nota_corte == null) {
                return res.status(400).json({
                    resposta: "Preencha todos os campos"
                })
            }

            // Verifica se a nota de corte é maior ou igual a zero
            if (nota_corte < 0) {
                return res.status(400).json({
                    resposta: "A nota de corte deve ser maior ou igual a zero"
                })
            }

            const existente = await CursosModel.buscarPorId(id_curso)

            if (!existente) {
                return res.status(404).json({
                    resposta: "Registro não encontrado"
                })
            }

            await CursosModel.atualizar(
                id_curso,
                id_universidade,
                curso,
                nota_corte
            )

            res.status(200).json({
                resposta: "Curso atualizado com sucesso"
            })

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
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

module.exports = CursoController