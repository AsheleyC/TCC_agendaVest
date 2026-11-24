const multer = require('multer')
const path = require('path')
const fs = require('fs')

const pasta = path.join(__dirname, '../../uploads/perfis')

if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pasta)
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname)
        const id = req.usuario?.id_usuario || 'novo'
        const nome = `perfil_${id}_${Date.now()}${extensao}`
        cb(null, nome)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error('Apenas imagens JPG, PNG ou WEBP são permitidas'))
        }

        cb(null, true)
    }
})

module.exports = upload