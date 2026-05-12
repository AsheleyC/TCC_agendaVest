require('dotenv').config()

const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const usuarioRoutes = require('./src/routes/usuarioRoutes')
const admRouter = require('./src/routes/admRouter.js')
const vestibularRouter = require('./src/routes/vestibularRouter')
const cursosRouter = require('./src/routes/cursosRouter')



const server = express()
const porta = process.env.porta

server.use(express.json())
server.use(cors())
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

server.use('/', usuarioRoutes)
server.use('/', admRouter)
server.use('/', vestibularRouter)
server.use('/', cursosRouter)

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})

module.exports = server