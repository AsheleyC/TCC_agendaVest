const express = require('express')
const router = express.Router()

const VestibularController = require('../controllers/vestibularController')

router.get('/verVest', VestibularController.listar)
router.post('/cadVest', VestibularController.cadastrar)
router.put('/atualVest/:id', VestibularController.atualizar)
router.delete('/delVest/:id', VestibularController.deletar)
router.get('/verVest/:id', VestibularController.buscarPorId)

module.exports = router