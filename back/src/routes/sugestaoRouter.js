const express = require('express')
const router = express.Router()

const SugestaoController = require('../controllers/sugestaoController')
const autenticarToken = require('../middlewares/autenticarToken')

router.post(
    '/addSugestao',
    autenticarToken,
    SugestaoController.adicionar
)

router.get(
    '/verSugestoes',
    SugestaoController.listar
)

router.delete(
    '/delSugestao/:id',
    SugestaoController.deletar
)

module.exports = router