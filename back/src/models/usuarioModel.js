/**
 * Model de Usuários.
 * Responsável por toda a comunicação com o banco de dados.
 * Centraliza as queries SQL da tabela `usuarios`.
 */
const pool = require('../../db')

const UsuarioModel = {

    async buscarPerfilPorId(id_usuario) {
        const sql = `SELECT nome_usuario, email, foto_perfil FROM usuarios WHERE id_usuario = ?`
        const [resultado] = await pool.query(sql, [id_usuario])
        return resultado
    },

    async buscarPorEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`
        const [resultado] = await pool.execute(sql, [email])
        return resultado
    },

    async buscarCredenciaisPorEmail(email) {
        const sql = `SELECT email, senha FROM usuarios WHERE email = ?`
        const [resultado] = await pool.execute(sql, [email])
        return resultado
    },

    async cadastrar(nome_usuario, email, senhaHash, foto_perfil) {
        const sql = `INSERT INTO usuarios (nome_usuario, email, senha, foto_perfil) VALUES (?, ?, ?, ?)`
        const [resultado] = await pool.execute(sql, [nome_usuario, email, senhaHash, foto_perfil])
        return resultado
    },

    async atualizarNome(nome_usuario, email) {
        const sql = `UPDATE usuarios SET nome_usuario = ? WHERE email = ?`
        const [resultado] = await pool.query(sql, [nome_usuario, email])
        return resultado
    },

    async atualizarEmail(emailNovo, emailAntigo) {
        const sql = `UPDATE usuarios SET email = ? WHERE email = ?`
        const [resultado] = await pool.query(sql, [emailNovo, emailAntigo])
        return resultado
    },

    async atualizarSenha(senhaHash, email) {
        const sql = `UPDATE usuarios SET senha = ? WHERE email = ?`
        const [resultado] = await pool.query(sql, [senhaHash, email])
        return resultado
    },

    async deletar(email, senhaHash) {
        const sql = `DELETE FROM usuarios WHERE email = ? AND senha = ?`
        const [resultado] = await pool.query(sql, [email, senhaHash])
        return resultado
    },
}

module.exports = UsuarioModel