const express = require('express')
const router = express.Router()
const ProvasController = require('../controllers/provasController')

router.get('/verProvas', ProvasController.listar)
router.get('/verProvas/:id_vestibular', ProvasController.listarPorVestibular)
router.post('/addProvas', ProvasController.inserir)
router.put('/atualProvas/:id_prova', ProvasController.atualizar)
router.delete('/delProvas/:id_prova', ProvasController.deletar)

module.exports = router