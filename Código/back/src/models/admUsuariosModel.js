const pool = require('../../db')

const AdmUsuariosModel = {
    async listar() {
        const sql = `
            SELECT
                u.id_usuario,
                u.nome_usuario,
                u.email,
                u.foto_perfil,
                (
                    SELECT COUNT(*)
                    FROM inscricoes i
                    WHERE i.id_usuario = u.id_usuario
                ) AS vestibulares_acompanhados
            FROM usuarios u
            ORDER BY u.id_usuario DESC
        `

        const [usuarios] = await pool.execute(sql)
        return usuarios
    },

    async contar() {
        const sql = `SELECT COUNT(*) AS total FROM usuarios`
        const [resultado] = await pool.execute(sql)
        return resultado[0].total
    },

    async excluir(id_usuario) {
        const conexao = await pool.getConnection()

        try {
            await conexao.beginTransaction()

            const [usuarios] = await conexao.execute(
                `SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE`,
                [id_usuario]
            )

            if (usuarios.length === 0) {
                await conexao.rollback()
                return false
            }

            await conexao.execute(
                `DELETE FROM inscricoes WHERE id_usuario = ?`,
                [id_usuario]
            )

            const [resultado] = await conexao.execute(
                `DELETE FROM usuarios WHERE id_usuario = ?`,
                [id_usuario]
            )

            if (resultado.affectedRows === 0) {
                await conexao.rollback()
                return false
            }

            await conexao.commit()
            return true
        } catch (error) {
            await conexao.rollback()
            throw error
        } finally {
            conexao.release()
        }
    }
}

module.exports = AdmUsuariosModel