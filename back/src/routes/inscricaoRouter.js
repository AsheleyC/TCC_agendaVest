const express = require('express')
const router = express.Router()
const InscricaoController = require('../controllers/inscricaoController')

router.post('/addInscricao', InscricaoController.adicionar)
router.get('/verInscricoes/:id_usuario', InscricaoController.listarPorUsuario)
router.delete('/delInscricao/:id', InscricaoController.deletar)

module.exports = router