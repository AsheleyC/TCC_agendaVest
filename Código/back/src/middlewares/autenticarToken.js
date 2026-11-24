const jwt = require('jsonwebtoken');

const api_key = process.env.api_key;

function autenticarToken(req, res, next) {
    try {
        const autorizacao = req.headers.authorization;

        if (!autorizacao) {
            return res.status(401).json({
                mensagem: 'Token não informado',
                status: 'false'
            });
        }

        const partes = autorizacao.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                mensagem: 'Formato do token inválido',
                status: 'false'
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(token, api_key);

        req.usuario = usuario;

        next();
    } catch (error) {
        console.error('[autenticarToken]', error);

        return res.status(401).json({
            mensagem: 'Token inválido ou expirado',
            status: 'false'
        });
    }
}

module.exports = autenticarToken;