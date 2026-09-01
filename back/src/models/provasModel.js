const pool = require('../../db')

const ProvasModel = {
    async listar() {
        const sql = `
            SELECT
                provas_anteriores.id_prova,
                vestibulares.vestibular,
                provas_anteriores.link_prova,
                provas_anteriores.link_gabarito,
                provas_anteriores.ano_prova,
                provas_anteriores.fase
            FROM provas_anteriores
            INNER JOIN vestibulares
            ON provas_anteriores.id_vestibular = vestibulares.id_vestibular
            ORDER BY provas_anteriores.ano_prova DESC, provas_anteriores.fase ASC
        `
        const [resultado] = await pool.query(sql)
        return resultado
    },

    async listarPorVestibular(id_vestibular) {
        const sql = `
            SELECT
                provas_anteriores.id_prova,
                vestibulares.vestibular,
                provas_anteriores.link_prova,
                provas_anteriores.link_gabarito,
                provas_anteriores.ano_prova,
                provas_anteriores.fase
            FROM provas_anteriores
            INNER JOIN vestibulares
            ON provas_anteriores.id_vestibular = vestibulares.id_vestibular
            WHERE provas_anteriores.id_vestibular = ?
            ORDER BY provas_anteriores.ano_prova DESC, provas_anteriores.fase ASC
        `
        const [resultado] = await pool.query(sql, [id_vestibular])
        return resultado
    },

    async buscarPorId(id_prova) {
        const sql = `
            SELECT *
            FROM provas_anteriores
            WHERE id_prova = ?
        `
        const [resultado] = await pool.query(sql, [id_prova])
        return resultado[0]
    },

    async buscarPorVestibularEAno(id_vestibular, ano_prova) {
        const sql = `
            SELECT *
            FROM provas_anteriores
            WHERE id_vestibular = ?
            AND ano_prova = ?
            ORDER BY fase ASC
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular,
            ano_prova
        ])
        return resultado
    },

    async buscarPorVestibularAnoEFase(id_vestibular, ano_prova, fase) {
        const sql = `
            SELECT *
            FROM provas_anteriores
            WHERE id_vestibular = ?
            AND ano_prova = ?
            AND fase = ?
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular,
            ano_prova,
            fase
        ])
        return resultado[0]
    },

    async inserir(id_vestibular, link_prova, link_gabarito, ano_prova, fase) {
        const sql = `
            INSERT INTO provas_anteriores
            (id_vestibular, link_prova, link_gabarito, ano_prova, fase)
            VALUES (?, ?, ?, ?, ?)
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular,
            link_prova,
            link_gabarito,
            ano_prova,
            fase
        ])
        return resultado
    },

    async atualizar(id_prova, id_vestibular, link_prova, link_gabarito, ano_prova, fase) {
        const sql = `
            UPDATE provas_anteriores
            SET
                id_vestibular = ?,
                link_prova = ?,
                link_gabarito = ?,
                ano_prova = ?,
                fase = ?
            WHERE id_prova = ?
        `
        const [resultado] = await pool.query(sql, [
            id_vestibular,
            link_prova,
            link_gabarito,
            ano_prova,
            fase,
            id_prova
        ])
        return resultado
    },

    async deletar(id_prova) {
        const sql = `
            DELETE FROM provas_anteriores
            WHERE id_prova = ?
        `
        const [resultado] = await pool.query(sql, [id_prova])
        return resultado
    }
}

module.exports = ProvasModel