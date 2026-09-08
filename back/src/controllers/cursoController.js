const CursosModel = require('../models/cursoModel')

const URL_MUNICIPIOS =
    'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/json/municipios.json'

const CursoController = {

    async listar(req, res) {
        try {
            const dados = await CursosModel.listar()

            res.status(200).json(dados)

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
        }
    },

    async buscarCursoMapa(req, res) {
        try {
            const { curso } = req.query

            if (!curso || !curso.trim()) {
                return res.status(400).json({
                    mensagem: 'Informe um curso',
                    status: 'false'
                })
            }

            const resultado = await CursosModel.buscarCursoMapa(curso.trim())

            if (resultado.length === 0) {
                return res.status(200).json({
                    mensagem: 'Nenhum curso encontrado',
                    status: 'true',
                    resultados: []
                })
            }

            const respostaMunicipios = await fetch(URL_MUNICIPIOS)

            if (!respostaMunicipios.ok) {
                return res.status(500).json({
                    mensagem:
                        'Não foi possível buscar as coordenadas dos municípios',
                    status: 'false'
                })
            }

            const municipios = await respostaMunicipios.json()

            const resultadosComCoordenadas =
                resultado.map(item => {

                    const municipioEncontrado = municipios.find(
                        municipio =>
                            Number(
                                municipio.codigo_ibge
                            ) ===
                            Number(
                                item.codigo_municipio_ibge
                            )
                    )

                    return {
                        ...item,

                        latitude:
                            municipioEncontrado
                                ? Number(
                                    municipioEncontrado.latitude
                                )
                                : null,

                        longitude:
                            municipioEncontrado
                                ? Number(
                                    municipioEncontrado.longitude
                                )
                                : null
                    }
                })

            return res.status(200).json({
                mensagem: 'Cursos encontrados com sucesso',
                status: 'true',
                resultados: resultadosComCoordenadas
            })

        } catch (error) {
            return res.status(500).json({
                mensagem: error.message,
                status: 'false'
            })
        }
    },

    async inserir(req, res) {
        try {
            const {
                id_universidade,
                curso,
                nota_corte
            } = req.body

            if (
                !id_universidade ||
                !curso ||
                nota_corte == null
            ) {
                return res.status(400).json({
                    resposta:
                        'Preencha todos os campos'
                })
            }

            if (!/^[A-Za-zÀ-ÿ\s]+$/.test(curso)) {
                return res.status(400).json({
                    resposta:
                        'O nome do curso deve conter apenas letras'
                })
            }

            if (nota_corte < 0) {
                return res.status(400).json({
                    resposta:
                        'A nota de corte deve ser maior ou igual a zero'
                })
            }

            await CursosModel.inserir(
                id_universidade,
                curso,
                nota_corte
            )

            res.status(201).json({
                resposta:
                    'Curso inserido com sucesso'
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

            const {
                id_universidade,
                curso,
                nota_corte
            } = req.body

            if (
                !id_universidade ||
                !curso ||
                nota_corte == null
            ) {
                return res.status(400).json({
                    resposta:
                        'Preencha todos os campos'
                })
            }

            if (nota_corte < 0) {
                return res.status(400).json({
                    resposta:
                        'A nota de corte deve ser maior ou igual a zero'
                })
            }

            const existente =
                await CursosModel.buscarPorId(
                    id_curso
                )

            if (!existente) {
                return res.status(404).json({
                    resposta:
                        'Registro não encontrado'
                })
            }

            await CursosModel.atualizar(
                id_curso,
                id_universidade,
                curso,
                nota_corte
            )

            res.status(200).json({
                resposta:
                    'Curso atualizado com sucesso'
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

            const existente =
                await CursosModel.buscarPorId(
                    id_curso
                )

            if (!existente) {
                return res.status(404).json({
                    resposta:
                        'Registro não encontrado'
                })
            }

            await CursosModel.deletar(
                id_curso
            )

            res.status(200).json({
                resposta:
                    'Curso deletado com sucesso'
            })

        } catch (error) {
            res.status(500).json({
                resposta: error.message
            })
        }
    }
}

module.exports = CursoController