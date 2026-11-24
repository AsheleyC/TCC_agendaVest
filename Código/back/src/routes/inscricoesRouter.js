const express = require('express')
const router = express.Router()
const InscricoesController = require('../controllers/inscricoesController')

router.post('/addInscricao', InscricoesController.adicionar)
router.get('/verInscricoes/:id_usuario', InscricoesController.listarPorUsuario)
router.delete('/delInscricao/:id', InscricoesController.deletar)

module.exports = router