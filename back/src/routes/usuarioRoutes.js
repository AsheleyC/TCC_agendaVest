/**
 * Rotas de Usuários.
 * Mapeia os endpoints para os métodos do UsuarioController.
 * Aplica o middleware de autenticação nas rotas protegidas.
 */
const { Router } = require('express')
const UsuarioController = require('../controllers/usuarioController')
const autenticarToken = require('../middlewares/autenticarToken')

const router = Router()

// ── Rotas públicas ────────────────────────────────────────────────────────────
router.get('/ver_perfil',UsuarioController.verPerfil)
router.post('/cadastro',UsuarioController.cadastrar)
router.post('/login',UsuarioController.login)
router.post('/atualizarSenha',UsuarioController.atualizarSenha)

// ── Rotas protegidas (requerem token JWT válido) ───────────────────────────────
router.put('/atualizar_nomeUsuario',    autenticarToken, UsuarioController.atualizarNome)
router.post('/atualizar_emailUsuario',  autenticarToken, UsuarioController.atualizarEmail)
router.delete('/deletar_usuario',       autenticarToken, UsuarioController.deletarUsuario)

module.exports = router