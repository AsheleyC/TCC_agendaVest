const cheerio = require('cheerio')

function converterData(data) {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes}-${dia}`
}

async function buscarUnicamp() {
    const url = 'https://www.comvest.unicamp.br/ingresso-2027/vestibular-2027/'

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
                    textoLink.includes('edital') ||
                    textoLink.includes('manual do ingresso')
                )
            ) {
                linkEdital = new URL(href, url).href
            }
        })

        const inscricoes = texto.match(
            /abertura para inscrições.*?(\d{2})\/(\d{2})\/(\d{4}).*?último dia para inscrição.*?(\d{1,2}) de setembro de (\d{4})/i
        )

        let dataInicio
        let dataFim

        if (inscricoes) {
            dataInicio = `${inscricoes[1]}/${inscricoes[2]}/${inscricoes[3]}`
            dataFim = `${inscricoes[4].padStart(2, '0')}/09/${inscricoes[5]}`
        } else {
            const inicio = texto.match(
                /03 de agosto de (\d{4}).*?inscrições/i
            )

            const fim = texto.match(
                /(\d{1,2}) de Setembro de (\d{4}).*?Último dia para inscrição/i
            )

            if (inicio && fim) {
                dataInicio = `03/08/${inicio[1]}`
                dataFim = `${fim[1].padStart(2, '0')}/09/${fim[2]}`
            }
        }

        if (!dataInicio || !dataFim) {
            throw new Error('Não foi possível encontrar o período de inscrições')
        }

        const taxaEncontrada = texto.match(
            /taxa de inscrição é de\s+([\d.,]+)\s+reais/i
        )

        if (!taxaEncontrada) {
            throw new Error('Não foi possível encontrar a taxa de inscrição')
        }

        const taxa = Number(
            taxaEncontrada[1]
                .replace('.', '')
                .replace(',', '.')
        )

        const primeiraFase = texto.match(
            /(\d{1,2})\s+de\s+Outubro\s+de\s+(\d{4})\s*[–-]\s*Prova da 1ª fase/i
        )

        if (!primeiraFase) {
            throw new Error('Não foi possível encontrar a data da primeira fase')
        }

        const dataProva = `${primeiraFase[1].padStart(2, '0')}/10/${primeiraFase[2]}`

        const dadosUnicamp = {
            vestibular: 'UNICAMP',
            data_inicio_inscricao: converterData(dataInicio),
            data_fim_inscricao: converterData(dataFim),
            data_prova: converterData(dataProva),
            taxa: taxa,
            link_edital: linkEdital
        }

        console.log('Dados encontrados pela UNICAMP:')
        console.log(dadosUnicamp)

        return dadosUnicamp
    } catch (erro) {
        console.error('Erro no scraping da UNICAMP:')
        throw erro
    }
}

module.exports = { buscarUnicamp }