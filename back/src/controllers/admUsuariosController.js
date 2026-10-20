const AdmUsuariosModel = require('../models/admUsuariosModel')

const AdmUsuariosController = {
    async listar(req, res) {
        try {
            const usuarios = await AdmUsuariosModel.listar()

            return res.json({
                status: 'true',
                usuarios
            })
        } catch (error) {
            console.error('[listarUsuariosADM]', error)

            return res.status(500).json({
                status: 'false',
                mensagem: 'Erro interno ao consultar usuários'
            })
        }
    },

    async contar(req, res) {
        try {
            const total = await AdmUsuariosModel.contar()

            return res.json({
                status: 'true',
                total
            })
        } catch (error) {
            console.error('[totalUsuariosADM]', error)

            return res.status(500).json({
                status: 'false',
                mensagem: 'Erro interno ao consultar total de usuários'
            })
        }
    },

    async excluir(req, res) {
        try {
            const id_usuario = Number(req.params.id_usuario)

            if (!Number.isSafeInteger(id_usuario) || id_usuario <= 0) {
                return res.status(400).json({
                    status: 'false',
                    mensagem: 'ID do usuário inválido'
                })
            }

            const excluido = await AdmUsuariosModel.excluir(id_usuario)

            if (!excluido) {
                return res.status(404).json({
                    status: 'false',
                    mensagem: 'Usuário não encontrado'
                })
            }

            return res.json({
                status: 'true',
                mensagem: 'Usuário excluído com sucesso'
            })
        } catch (error) {
            console.error('[excluirUsuarioADM]', error)

            if (
                error.code === 'ER_ROW_IS_REFERENCED_2' ||
                error.code === 'ER_ROW_IS_REFERENCED' ||
                error.errno === 1451
            ) {
                return res.status(409).json({
                    status: 'false',
                    mensagem: 'Este usuário possui outros registros vinculados. Não foi possível excluir a conta sem comprometer os dados.'
                })
            }

            return res.status(500).json({
                status: 'false',
                mensagem: 'Erro interno ao excluir usuário'
            })
        }
    }
}

module.exports = AdmUsuariosController