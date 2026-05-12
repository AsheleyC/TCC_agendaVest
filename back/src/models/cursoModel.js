const pool = require('../../db')

const CursosModel = {

    async listar() {
        const sql = `
            SELECT
                cursos.id_curso,
                universidades.nome AS universidade,
                cursos.curso,
                cursos.nota_corte
            FROM cursos
            INNER JOIN universidades
            ON cursos.id_universidade = universidades.id_universidade
        `
        const [resultado] = await pool.query(sql)
        return resultado
    },

    async buscarPorId(id_curso) {
        const sql = `SELECT * FROM cursos WHERE id_curso = ?`
        const [resultado] = await pool.query(sql, [id_curso])
        return resultado[0]
    },

    async inserir(id_universidade, curso, nota_corte) {
        const sql = `
            INSERT INTO cursos (id_universidade, curso, nota_corte)
            VALUES (?, ?, ?)
        `
        const [resultado] = await pool.query(sql, [
            id_universidade, curso, nota_corte
        ])
        return resultado
    },

    async atualizar(id_curso, id_universidade, curso, nota_corte) {
        const sql = `
            UPDATE cursos 
            SET id_universidade = ?, curso = ?, nota_corte = ?
            WHERE id_curso = ?
        `
        const [resultado] = await pool.query(sql, [
            id_universidade, curso, nota_corte, id_curso
        ])
        return resultado
    },

    async deletar(id_curso) {
        const sql = `DELETE FROM cursos WHERE id_curso = ?`
        const [resultado] = await pool.query(sql, [id_curso])
        return resultado
    }
}

module.exports = CursosModel