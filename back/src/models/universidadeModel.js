const pool = require('../../db')

const universidadesModel = {
    async listar() {
        const [dados] = await pool.query(`
            SELECT
                id_universidade,
                nome AS universidade
            FROM universidades
            WHERE situacao = 'Ativa'
            ORDER BY nome
        `);

        return dados;
    }
}

module.exports = universidadesModel