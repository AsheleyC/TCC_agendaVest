const jwt = require('jsonwebtoken')

function autenticarAdm(req, res, next) {
    const authHeader =
        req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            mensagem: "Token não informado"
        })
    }

    const partes =
        authHeader.split(' ')

    if (
        partes.length !== 2 ||
        partes[0] !== 'Bearer'
    ) {
        return res.status(401).json({
            mensagem: "Token inválido"
        })
    }

    const token = partes[1]

    try {
        const dados =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            )

        if (dados.tipo !== 'adm') {
            return res.status(403).json({
                mensagem: "Acesso permitido apenas para administradores"
            })
        }

        req.adm = dados

        next()

    } catch (error) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado"
        })
    }
}

module.exports = autenticarAdm