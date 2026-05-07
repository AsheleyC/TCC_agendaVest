/**
 * Middleware de autenticação JWT.
 * Verifica se o token Bearer no header Authorization é válido.
 * Em caso de sucesso, injeta os dados do usuário em req.user e chama next().
 */
const jwt = require('jsonwebtoken')

const api_key = process.env.api_key

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    const token = authHeader.split(' ')[1] // Formato: "Bearer <token>"

    jwt.verify(token, api_key, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' })
        }
        req.user = user
        next()
    })
}

module.exports = autenticarToken