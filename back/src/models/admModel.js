const pool = require('../../db')

const admModel = {
    async  criarAdm(email, senhaHash) {
        const sql = `INSERT INTO adms (email, senha) VALUES (?, ?)`
        const [result] = await pool.execute(sql, [email, senhaHash])
        return result
    },
    
    async  buscarPorEmail(email) {
        const sql = `SELECT * FROM adms WHERE email = ?`
        const [rows] = await pool.execute(sql, [email])
        return rows[0]
    }
    
}
module.exports = admModel