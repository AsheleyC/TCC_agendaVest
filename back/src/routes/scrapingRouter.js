const express = require('express')

const router = express.Router()

//vestibulares
const { buscarFuvest } = require('../scraping/fuvest')
const { buscarUnicamp } = require('../scraping/unicamp')

//provas
const { buscarProvasFuvest } = require('../scraping/provasFuvest')
const { buscarProvasUnicamp } = require('../scraping/provasUnicamp')


const VestibularModel = require('../models/vestibularModel')
const ProvasModel = require('../models/provasModel')



//vestibulares
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

router.post('/unicamp', async (req, res) => {
    try {
        console.log('1 - Rota da UNICAMP foi acessada')
        console.log('2 - Iniciando scraping...')

        const dadosUnicamp = await buscarUnicamp()

        console.log('3 - Scraping terminou!')
        console.log(dadosUnicamp)

        console.log('4 - Verificando se já existe...')

        const vestibularExistente = await VestibularModel.buscarPorNome(
            dadosUnicamp.vestibular
        )

        let resultado
        let acao

        if (vestibularExistente) {
            console.log('5 - Vestibular já existe. Atualizando...')

            resultado = await VestibularModel.atualizar(
                vestibularExistente.id_vestibular,
                dadosUnicamp.vestibular,
                dadosUnicamp.data_inicio_inscricao,
                dadosUnicamp.data_fim_inscricao,
                dadosUnicamp.data_prova,
                dadosUnicamp.taxa,
                dadosUnicamp.link_edital
            )

            acao = 'atualizado'
        } else {
            console.log('5 - Vestibular não existe. Inserindo...')

            resultado = await VestibularModel.addVestibular(
                dadosUnicamp.vestibular,
                dadosUnicamp.data_inicio_inscricao,
                dadosUnicamp.data_fim_inscricao,
                dadosUnicamp.data_prova,
                dadosUnicamp.taxa,
                dadosUnicamp.link_edital
            )

            acao = 'inserido'
        }

        console.log(`6 - Vestibular ${acao} com sucesso!`)

        return res.status(200).json({
            mensagem: `Dados da UNICAMP ${acao} com sucesso!`,
            acao: acao,
            dados: dadosUnicamp
        })
    } catch (erro) {
        console.error('ERRO:', erro)

        return res.status(500).json({
            erro: 'Erro ao buscar ou salvar os dados da UNICAMP'
        })
    }
})

router.post('/unesp', async (req, res) => {
    try {
        console.log('1 - Rota da UNESP foi acessada')
        console.log('2 - Iniciando scraping...')

        const dadosUnesp = await buscarUnesp()

        console.log('3 - Scraping terminou!')
        console.log(dadosUnesp)

        console.log('4 - Verificando se já existe...')

        const vestibularExistente = await VestibularModel.buscarPorNome(
            dadosUnesp.vestibular
        )

        let resultado
        let acao

        if (vestibularExistente) {
            console.log('5 - Vestibular já existe. Atualizando...')

            resultado = await VestibularModel.atualizar(
                vestibularExistente.id_vestibular,
                dadosUnesp.vestibular,
                dadosUnesp.data_inicio_inscricao,
                dadosUnesp.data_fim_inscricao,
                dadosUnesp.data_prova,
                dadosUnesp.taxa,
                dadosUnesp.link_edital
            )

            acao = 'atualizado'
        } else {
            console.log('5 - Vestibular não existe. Inserindo...')

            resultado = await VestibularModel.addVestibular(
                dadosUnesp.vestibular,
                dadosUnesp.data_inicio_inscricao,
                dadosUnesp.data_fim_inscricao,
                dadosUnesp.data_prova,
                dadosUnesp.taxa,
                dadosUnesp.link_edital
            )

            acao = 'inserido'
        }

        console.log(`6 - Vestibular ${acao} com sucesso!`)

        return res.status(200).json({
            mensagem: `Dados da UNESP ${acao} com sucesso!`,
            acao: acao,
            dados: dadosUnesp
        })

    } catch (erro) {
        console.error('ERRO:', erro)

        return res.status(500).json({
            erro: 'Erro ao buscar ou salvar os dados da UNESP'
        })
    }
})

//provas

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
            const existente = await ProvasModel.buscarPorVestibularAnoEFase(
                vestibular.id_vestibular,
                prova.ano_prova,
                prova.fase
            )

            if (existente) {
                await ProvasModel.atualizar(
                    existente.id_prova,
                    vestibular.id_vestibular,
                    prova.link_prova,
                    prova.link_gabarito,
                    prova.ano_prova,
                    prova.fase
                )

                atualizadas++
            } else {
                await ProvasModel.inserir(
                    vestibular.id_vestibular,
                    prova.link_prova,
                    prova.link_gabarito,
                    prova.ano_prova,
                    prova.fase
                )

                inseridas++
            }
        }

        console.log('5 - Dados salvos com sucesso!')

        return res.status(200).json({
            mensagem: 'Provas da FUVEST processadas com sucesso',
            total_encontradas: provas.length,
            inseridas,
            atualizadas,
            dados: provas
        })
    } catch (erro) {
        console.error('ERRO:', erro)

        return res.status(500).json({
            erro: 'Erro ao buscar ou salvar as provas da FUVEST'
        })
    }
}),

    router.post('/unicamp/provas', async (req, res) => {
        try {
            console.log('1 - Rota de provas da UNICAMP foi acessada')
            console.log('2 - Buscando a UNICAMP no banco...')

            const vestibular = await VestibularModel.buscarPorNome('UNICAMP')

            if (!vestibular) {
                return res.status(404).json({
                    erro: 'UNICAMP não encontrada no banco'
                })
            }

            console.log('3 - Iniciando scraping das provas...')

            const provas = await buscarProvasUnicamp()

            console.log('4 - Scraping das provas terminou!')

            let inseridas = 0
            let atualizadas = 0
            let ignoradas = 0

            for (const prova of provas) {
                if (!prova.link_prova) {
                    console.log(
                        `Prova sem link encontrada para ${prova.ano_prova} - ${prova.fase}. Pulando...`
                    )

                    ignoradas++
                    continue
                }

                const existente =
                    await ProvasModel.buscarPorVestibularAnoEFase(
                        vestibular.id_vestibular,
                        prova.ano_prova,
                        prova.fase
                    )

                if (existente) {
                    await ProvasModel.atualizar(
                        existente.id_prova,
                        vestibular.id_vestibular,
                        prova.link_prova,
                        prova.link_gabarito,
                        prova.ano_prova,
                        prova.fase
                    )

                    atualizadas++
                } else {
                    await ProvasModel.inserir(
                        vestibular.id_vestibular,
                        prova.link_prova,
                        prova.link_gabarito,
                        prova.ano_prova,
                        prova.fase
                    )

                    inseridas++
                }
            }

            console.log('5 - Dados salvos com sucesso!')

            return res.status(200).json({
                mensagem: 'Provas da UNICAMP processadas com sucesso',
                total_encontradas: provas.length,
                inseridas,
                atualizadas,
                ignoradas,
                dados: provas
            })
        } catch (erro) {
            console.error('ERRO:', erro)

            return res.status(500).json({
                erro: 'Erro ao buscar ou salvar as provas da UNICAMP'
            })
        }
    })

module.exports = router