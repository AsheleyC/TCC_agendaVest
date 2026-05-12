const pool = require('../../db')

const ProvasModel = {

    async listar() {
        const sql = `
            SELECT
                provas_anteriores.id_prova,
                vestibulares.vestibular,
                provas_anteriores.link_prova,
                provas_anteriores.link_gabarito,
                provas_anteriores.ano_prova
            FROM provas_anteriores
            INNER JOIN vestibulares
            ON provas_anteriores.id_vestibular = vestibulares.id_vestibular
        `
        const [resultado] = await pool.query(sql)
        return resultado
    },

    async buscarPorId(id_prova) {
        const sql = `SELECT * FROM provas_anteriores WHERE id_prova = ?`
        const [resultado] = await pool.query(sql, [id_prova])
        return resultado[0]
    },

    async inserir(id_vestibular, link_prova, link_gabarito, ano_prova) {
        const sql = `
            INSERT INTO provas_anteriores 
            (id_vestibular, link_prova, link_gabarito, ano_prova) 
            VALUES (?, ?, ?, ?)
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular, link_prova, link_gabarito, ano_prova
        ])
        return resultado
    },

    async atualizar(id_prova, id_vestibular, link_prova, link_gabarito, ano_prova) {
        const sql = `
            UPDATE provas_anteriores 
            SET id_vestibular = ?, link_prova = ?, link_gabarito = ?, ano_prova = ?
            WHERE id_prova = ?
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular, link_prova, link_gabarito, ano_prova, id_prova
        ])
        return resultado
    },

    async deletar(id_prova) {
        const sql = `DELETE FROM provas_anteriores WHERE id_prova = ?`
        const [resultado] = await pool.query(sql, [id_prova])
        return resultado
    }
}

module.exports = ProvasModel