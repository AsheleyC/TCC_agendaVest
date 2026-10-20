const { Router } = require('express')
const admController = require('../controllers/admController')
const admUsuariosController = require('../controllers/admUsuariosController')
const autenticarAdm = require('../middlewares/autenticarAdm')

const router = Router()

router.post('/cadADM', admController.cadastrar)
router.post('/loginADM', admController.login)
router.get('/validarADM', autenticarAdm, admController.validar)

router.get('/verUsuariosADM', autenticarAdm, admUsuariosController.listar)
router.get('/totalUsuariosADM', autenticarAdm, admUsuariosController.contar)
router.delete('/deletarUsuarioADM/:id_usuario', autenticarAdm, admUsuariosController.excluir)

module.exports = router