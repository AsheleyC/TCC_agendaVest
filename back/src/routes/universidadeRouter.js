const express = require('express')
const router = express.Router()

const universidadesController = require("../controllers/universidadeController")

router.get('/verUniversidade', universidadesController.listar);

module.exports = router