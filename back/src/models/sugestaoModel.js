const pool = require('../../db')

const SugestaoModel = {
    async adicionarSugestao(id_usuario, vest_sugestao, curso_sugestao) {
        const sql = `
            INSERT INTO sugestao
            (id_usuario, vest_sugestao, curso_sugestao)
            VALUES (?, ?, ?)
        `

        const [resultado] = await pool.execute(sql, [
            id_usuario,
            vest_sugestao,
            curso_sugestao
        ])

        return resultado
    },

    async listarSugestoes() {
        const sql = `
        SELECT
            s.id_sugestao,
            s.id_usuario,
            u.nome_usuario,
            u.email,
            s.vest_sugestao,
            s.curso_sugestao
        FROM sugestao s
        INNER JOIN usuarios u
            ON s.id_usuario = u.id_usuario
        ORDER BY s.id_sugestao DESC
    `

        const [resultado] = await pool.query(sql)

        return resultado
    },

    async deletarSugestao(id_sugestao) {
        const sql = `
        DELETE FROM sugestao
        WHERE id_sugestao = ?
    `

        const [resultado] = await pool.execute(sql, [
            id_sugestao
        ])

        return resultado
    }
}

module.exports = SugestaoModel