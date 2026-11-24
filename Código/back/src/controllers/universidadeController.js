const universidadesModel = require('../models/universidadeModel')

const universidadesController = {
    async listar(req, res) {
        try {
          const dados = await universidadesModel.listar();
          res.status(200).json(dados);
        } catch (error) {
          res.status(500).json({ resposta: error.message });
        }
      }
}

module.exports = universidadesController