const { Router } = require('express')
const admController = require('../controllers/admController')

const router = Router()

router.post('/cadADM', admController.cadastrar)
router.post('/loginADM', admController.login)

module.exports = router