const SugestaoModel = require('../models/sugestaoModel')

const SugestaoController = {
    async adicionar(req, res) {
        try {
            const id_usuario = req.usuario.id_usuario
            const { vest_sugestao, curso_sugestao } = req.body

            if (!vest_sugestao && !curso_sugestao) {
                return res.status(400).json({
                    mensagem: 'Digite uma sugestão de vestibular ou curso',
                    status: 'false'
                })
            }

            const vestibular = vest_sugestao?.trim() || null
            const curso = curso_sugestao?.trim() || null

            if (!vestibular && !curso) {
                return res.status(400).json({
                    mensagem: 'Digite uma sugestão válida',
                    status: 'false'
                })
            }

            const resultado = await SugestaoModel.adicionarSugestao(
                id_usuario,
                vestibular,
                curso
            )

            if (resultado.affectedRows === 0) {
                return res.status(400).json({
                    mensagem: 'Não foi possível enviar a sugestão',
                    status: 'false'
                })
            }

            return res.status(201).json({
                mensagem: 'Sugestão enviada com sucesso',
                status: 'true'
            })
        } catch (error) {
            console.error('[adicionarSugestao]', error)

            return res.status(500).json({
                mensagem: 'Erro interno ao enviar sugestão',
                status: 'false'
            })
        }
    },

    async listar(req, res) {
        try {
            const sugestoes = await SugestaoModel.listarSugestoes()

            return res.status(200).json({
                mensagem: 'Sugestões encontradas com sucesso',
                status: 'true',
                sugestoes: sugestoes
            })
        } catch (error) {
            console.error('[listarSugestoes]', error)

            return res.status(500).json({
                mensagem: 'Erro interno ao buscar sugestões',
                status: 'false'
            })
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params

            const resultado =
                await SugestaoModel.deletarSugestao(id)

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: 'Sugestão não encontrada',
                    status: 'false'
                })
            }

            return res.status(200).json({
                mensagem: 'Sugestão removida com sucesso',
                status: 'true'
            })
        } catch (error) {
            console.error('[deletarSugestao]', error)

            return res.status(500).json({
                mensagem: 'Erro interno ao remover sugestão',
                status: 'false'
            })
        }
    }
}

module.exports = SugestaoController