const express = require('express')
const router = express.Router()

const CursosController = require('../controllers/cursoController')

router.get('/verCurso', CursosController.listar)
router.post('/addCurso', CursosController.inserir)
router.put('/atualCurso/:id_curso', CursosController.atualizar)
router.delete('/delCurso/:id_curso', CursosController.deletar)

module.exports = router