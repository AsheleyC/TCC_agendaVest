const pool = require('../../db')

const InscricaoModel = {

    async adicionarInscricao(id_usuario, id_vestibular, notificar_inscricao) {

        const sql = `
            INSERT INTO inscricoes
            (id_usuario, id_vestibular, notificar_inscricao)
            VALUES (?, ?, ?)
        `

        const [resultado] = await pool.execute(sql, [
            id_usuario, id_vestibular, notificar_inscricao
        ])

        return resultado

    },

    async verificarInscricao(id_usuario, id_vestibular) {

        const sql = `
            SELECT * FROM inscricoes
            WHERE id_usuario = ? AND id_vestibular = ?
        `

        const [resultado] = await pool.execute(sql, [id_usuario, id_vestibular])

        return resultado[0]

    },

    async listarPorUsuario(id_usuario) {

        const sql = `
            SELECT
                inscricoes.id_inscricao,
                inscricoes.notificar_inscricao,
                vestibulares.id_vestibular,
                vestibulares.vestibular,
                vestibulares.data_inicio_inscricao,
                vestibulares.data_fim_inscricao,
                vestibulares.data_prova,
                vestibulares.taxa_prova,
                vestibulares.link_edital
            FROM inscricoes
            INNER JOIN vestibulares
            ON inscricoes.id_vestibular = vestibulares.id_vestibular
            WHERE inscricoes.id_usuario = ?
            ORDER BY vestibulares.data_prova ASC
        `

        const [resultado] = await pool.execute(sql, [id_usuario])

        return resultado

    },

    async deletar(id_inscricao) {

        const sql = `DELETE FROM inscricoes WHERE id_inscricao = ?`

        const [resultado] = await pool.execute(sql, [id_inscricao])

        return resultado

    },

    async buscarPorId(id_inscricao) {

        const sql = `SELECT * FROM inscricoes WHERE id_inscricao = ?`

        const [resultado] = await pool.execute(sql, [id_inscricao])

        return resultado[0]

    }

}

module.exports = InscricaoModel