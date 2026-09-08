const { Router } = require('express')
const admController = require('../controllers/admController')
const autenticarAdm = require('../middlewares/autenticarAdm')

const router = Router()

router.post('/cadADM', admController.cadastrar)
router.post('/loginADM', admController.login)
router.get('/validarADM', autenticarAdm, admController.validar)

module.exports = router