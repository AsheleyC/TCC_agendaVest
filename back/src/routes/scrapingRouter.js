const express = require('express')

const router = express.Router()

const { buscarFuvest } = require('../scraping/fuvest')
const { buscarProvasFuvest } = require('../scraping/provasFuvest')

const VestibularModel = require('../models/vestibularModel')
const ProvasModel = require('../models/provasModel')

router.post('/fuvest', async (req, res) => {

    try {

        console.log('1 - Rota foi acessada')

        console.log('2 - Iniciando scraping...')

        const dadosFuvest = await buscarFuvest()

        console.log('3 - Scraping terminou!')

        console.log(dadosFuvest)

        console.log('4 - Verificando se já existe...')

        const vestibularExistente = await VestibularModel.buscarPorNome(
            dadosFuvest.vestibular
        )

        let resultado
        let acao

        if (vestibularExistente) {

            console.log('5 - Vestibular já existe. Atualizando...')

            resultado = await VestibularModel.atualizar(

                vestibularExistente.id_vestibular,

                dadosFuvest.vestibular,

                dadosFuvest.data_inicio_inscricao,

                dadosFuvest.data_fim_inscricao,

                dadosFuvest.data_prova,

                dadosFuvest.taxa,

                dadosFuvest.link_edital

            )

            acao = 'atualizado'

        } else {

            console.log('5 - Vestibular não existe. Inserindo...')

            resultado = await VestibularModel.addVestibular(

                dadosFuvest.vestibular,

                dadosFuvest.data_inicio_inscricao,

                dadosFuvest.data_fim_inscricao,

                dadosFuvest.data_prova,

                dadosFuvest.taxa,

                dadosFuvest.link_edital

            )

            acao = 'inserido'

        }

        console.log(`6 - Vestibular ${acao} com sucesso!`)

        return res.status(200).json({

            mensagem: `Dados da FUVEST ${acao} com sucesso!`,

            acao: acao,

            dados: dadosFuvest

        })

    } catch (erro) {

        console.error('ERRO:', erro)

        return res.status(500).json({

            erro: 'Erro ao buscar ou salvar os dados da FUVEST'

        })

    }

})

router.post('/fuvest/provas', async (req, res) => {

    try {

        console.log('1 - Rota de provas da FUVEST foi acessada')

        console.log('2 - Buscando a FUVEST no banco...')

        const vestibular = await VestibularModel.buscarPorNome('FUVEST')

        if (!vestibular) {

            return res.status(404).json({

                erro: 'FUVEST não encontrada no banco'

            })

        }

        console.log('3 - Iniciando scraping das provas...')

        const provas = await buscarProvasFuvest()

        console.log('4 - Scraping das provas terminou!')

        let inseridas = 0
        let atualizadas = 0

        for (const prova of provas) {

            const existente =
                await ProvasModel.buscarPorVestibularEAno(

                    vestibular.id_vestibular,

                    prova.ano_prova

                )

            if (existente) {

                await ProvasModel.atualizar(

                    existente.id_prova,

                    vestibular.id_vestibular,

                    prova.link_prova,

                    prova.link_gabarito,

                    prova.ano_prova

                )

                atualizadas++

            } else {

                await ProvasModel.inserir(

                    vestibular.id_vestibular,

                    prova.link_prova,

                    prova.link_gabarito,

                    prova.ano_prova

                )

                inseridas++

            }

        }

        console.log('5 - Dados salvos com sucesso!')

        return res.status(200).json({

            mensagem: 'Provas da FUVEST processadas com sucesso',

            total_encontradas: provas.length,

            inseridas: inseridas,

            atualizadas: atualizadas,

            dados: provas

        })

    } catch (erro) {

        console.error('ERRO:', erro)

        return res.status(500).json({
            erro: 'Erro ao buscar ou salvar as provas da FUVEST'
        })

    }

})

module.exports = router