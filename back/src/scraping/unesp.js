const cheerio = require('cheerio')

function converterData(data) {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes}-${dia}`
}

async function buscarUnesp() {
    const url = 'https://vestibular.unesp.br/'

    try {
        const resposta = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        })

        if (!resposta.ok) {
            throw new Error(`Erro ao acessar a página: ${resposta.status}`)
        }

        const html = await resposta.text()
        const $ = cheerio.load(html)

        const texto = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim()

        let linkEdital = null

        $('a').each((index, elemento) => {
            const textoLink = $(elemento)
                .text()
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase()

            const href = $(elemento).attr('href')

            if (
                href &&
                !linkEdital &&
                (
                    textoLink.includes('manual do candidato') ||
                    textoLink.includes('edital')
                )
            ) {
                linkEdital = new URL(href, url).href
            }
        })

        let dataInicio = null
        let dataFim = null

        const datas = texto.match(
            /(?:inscri(?:ções|ção)|inscrições).*?(\d{1,2})\s*(?:de\s+)?(?:setembro|\/09\/)\s*(?:a|até)\s*(\d{1,2})\s*(?:de\s+)?(?:outubro|\/10\/)\s*(?:de\s+)?2026/i
        )

        if (datas) {
            dataInicio = `${datas[1].padStart(2, '0')}/09/2026`
            dataFim = `${datas[2].padStart(2, '0')}/10/2026`
        }

        if (!dataInicio || !dataFim) {
            const datasNumericas = texto.match(
                /(?:inscri(?:ções|ção)|inscrições).*?(\d{1,2}\/\d{1,2}\/2026).*?(?:a|até).*?(\d{1,2}\/\d{1,2}\/2026)/i
            )

            if (datasNumericas) {
                dataInicio = datasNumericas[1]
                dataFim = datasNumericas[2]
            }
        }

        if (!dataInicio || !dataFim) {
            const inicio = texto.match(
                /(\d{1,2})\s+de\s+setembro\s+de\s+2026/i
            )

            const fim = texto.match(
                /(\d{1,2})\s+de\s+outubro\s+de\s+2026/i
            )

            if (inicio && fim) {
                dataInicio = `${inicio[1].padStart(2, '0')}/09/2026`
                dataFim = `${fim[1].padStart(2, '0')}/10/2026`
            }
        }

        if (!dataInicio || !dataFim) {
            throw new Error('Não foi possível encontrar as datas de inscrição')
        }

        const taxaEncontrada = texto.match(
            /taxa.*?(?:R\$|R\$\s*)\s*([\d.,]+)/i
        )

        if (!taxaEncontrada) {
            throw new Error('Não foi possível encontrar a taxa de inscrição')
        }

        const taxa = Number(
            taxaEncontrada[1]
                .replace(/\./g, '')
                .replace(',', '.')
        )

        let dataProva = null

        const primeiraFase = texto.match(
            /(?:1[ªa]?|primeira)\s*fase.*?(\d{1,2})\s*(?:de\s+)?novembro\s*(?:de\s+)?2026/i
        )

        if (primeiraFase) {
            dataProva = `${primeiraFase[1].padStart(2, '0')}/11/2026`
        }

        if (!dataProva) {
            const primeiraFaseNumerica = texto.match(
                /(?:1[ªa]?|primeira)\s*fase.*?(\d{1,2}\/11\/2026)/i
            )

            if (primeiraFaseNumerica) {
                dataProva = primeiraFaseNumerica[1]
            }
        }

        if (!dataProva) {
            throw new Error('Não foi possível encontrar a data da primeira fase')
        }

        const dadosUnesp = {
            vestibular: 'UNESP',
            data_inicio_inscricao: converterData(dataInicio),
            data_fim_inscricao: converterData(dataFim),
            data_prova: converterData(dataProva),
            taxa: taxa,
            link_edital: linkEdital
        }

        console.log('Dados encontrados pela UNESP:')
        console.log(dadosUnesp)

        return dadosUnesp
    } catch (erro) {
        console.error('Erro no scraping da UNESP:')
        throw erro
    }
}

module.exports = { buscarUnesp }