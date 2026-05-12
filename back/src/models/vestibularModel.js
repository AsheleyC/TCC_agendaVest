const pool = require('../../db')

const VestibularModel = {

    async mostrarVestibular() {
        const sql = `SELECT * FROM vestibulares`
        const [resultado] = await pool.execute(sql)
        return resultado
    },

    async buscarPorId(id) {
        const sql = `SELECT * FROM vestibulares WHERE id = ?`
        const [resultado] = await pool.execute(sql, [id])
        return resultado[0]
    },

    async addVestibular(vestibular, dt_inicio, dt_fim, dt_prova, taxa, link) {
        const sql = `INSERT INTO vestibulares 
        (vestibular, data_inicio_inscricao, data_fim_inscricao, data_prova, taxa_prova, link_edital, status) 
        VALUES (?,?,?,?,?,?,?)`

        const [resultado] = await pool.execute(sql, [
            vestibular, dt_inicio, dt_fim, dt_prova, taxa, link, 'ativo'
        ])

        return resultado
    },

    async atualizar(id, vestibular, dt_inicio, dt_fim, dt_prova, taxa, link) {
        const sql = `UPDATE vestibulares SET 
            vestibular = ?, 
            data_inicio_inscricao = ?, 
            data_fim_inscricao = ?, 
            data_prova = ?, 
            taxa_prova = ?, 
            link_edital = ?
        WHERE id = ?`

        const [resultado] = await pool.execute(sql, [
            vestibular, dt_inicio, dt_fim, dt_prova, taxa, link, id
        ])

        return resultado
    },

    async deletar(id) {
        const sql = `DELETE FROM vestibulares WHERE id = ?`
        const [resultado] = await pool.execute(sql, [id])
        return resultado
    }
}

module.exports = VestibularModel