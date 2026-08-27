const { Router } = require('express')
const UsuarioController = require('../controllers/usuarioController')
const autenticarToken = require('../middlewares/autenticarToken')
const upload = require('../middlewares/uploadFoto')

const router = Router()

router.get('/ver_perfil', autenticarToken, UsuarioController.verPerfil)
router.post('/cadastro', UsuarioController.cadastrar)
router.post('/login', UsuarioController.login)
router.post('/atualizarSenha', UsuarioController.atualizarSenha)

router.put('/atualizar_nomeUsuario', autenticarToken, UsuarioController.atualizarNome)
router.post('/atualizar_emailUsuario', autenticarToken, UsuarioController.atualizarEmail)
router.put('/atualizar_foto', autenticarToken, upload.single('foto'), UsuarioController.atualizarFoto)
router.delete('/deletar_usuario', autenticarToken, UsuarioController.deletarUsuario)

module.exports = router