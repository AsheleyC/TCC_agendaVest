require('dotenv').config()
const ip = require('ip')
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const usuarioRoutes = require('./src/routes/usuarioRoutes')
const admRouter = require('./src/routes/admRouter.js')
const vestibularRouter = require('./src/routes/vestibularRouter')
const cursosRouter = require('./src/routes/cursoRouter.js')
const provasRouter = require('./src/routes/provasRouter')
const universidadeRouter = require('./src/routes/universidadeRouter.js')
const scrapingRouter = require('./src/routes/scrapingRouter.js')
const inscricoesRouter = require('./src/routes/inscricoesRouter.js')
const sugestaoRouter = require('./src/routes/sugestaoRouter.js')

const server = express()
const porta = process.env.porta

server.use(express.json())
server.use(cors())

server.use('/uploads', express.static('uploads'))

server.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
)

server.use('/', usuarioRoutes)
server.use('/', admRouter)
server.use('/', vestibularRouter)
server.use('/', cursosRouter)
server.use('/', provasRouter)
server.use('/', universidadeRouter)
server.use('/', scrapingRouter)
server.use('/', inscricoesRouter)
server.use('/', sugestaoRouter)

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://${ip.address()}:${porta}`)
})

module.exports = server