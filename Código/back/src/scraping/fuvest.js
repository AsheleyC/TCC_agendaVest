const cheerio = require('cheerio')

function converterData(data) {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes}-${dia}`
}

async function buscarFuvest() {

    const url = 'https://www.fuvest.br/vestibular-da-usp'

    try {

        // 1. Acessa a página da FUVEST
        const resposta = await fetch(url)

        if (!resposta.ok) {
            throw new Error(`Erro ao acessar a página: ${resposta.status}`)
        }

        // 2. Pega o HTML da página
        const html = await resposta.text()

        // 3. Carrega o HTML no Cheerio
        const $ = cheerio.load(html)

        // 4. Pega todo o texto da página
        const texto = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim()

        // --------------------------------------------------
        // 5. ENCONTRAR O LINK DO EDITAL
        // --------------------------------------------------

        let linkEdital = null

        $('a').each((index, elemento) => {

            const textoLink = $(elemento)
                .text()
                .trim()

            const href = $(elemento)
                .attr('href')

            if (
                href &&
                (
                    textoLink.includes('Resolução') ||
                    textoLink.includes('Edital') ||
                    textoLink.includes('Programa do Vestibular')
                )
            ) {

                linkEdital = new URL(href, url).href

            }

        })

        // --------------------------------------------------
        // 6. ENCONTRAR AS DATAS DE INSCRIÇÃO
        // --------------------------------------------------

        const inscricoes = texto.match(
            /INSCRIÇÕES.*?das\s+\d+h\s+de\s+(\d{2}\/\d{2}\/\d{4})\s+até\s+as\s+\d{2}h\s+de\s+(\d{2}\/\d{2}\/\d{4})/i
        )

        if (!inscricoes) {
            throw new Error(
                'Não foi possível encontrar o período de inscrições'
            )
        }

        const dataInicio = inscricoes[1]
        const dataFim = inscricoes[2]

        // --------------------------------------------------
        // 7. ENCONTRAR A TAXA
        // --------------------------------------------------

        const taxaEncontrada = texto.match(
            /TAXA DE INSCRIÇÃO\s+R\$\s*([\d.,]+)/i
        )

        if (!taxaEncontrada) {
            throw new Error(
                'Não foi possível encontrar a taxa de inscrição'
            )
        }

        const taxa = Number(
            taxaEncontrada[1]
                .replace('.', '')
                .replace(',', '.')
        )

        // --------------------------------------------------
        // 8. ENCONTRAR A DATA DA PRIMEIRA PROVA
        // --------------------------------------------------

        const primeiraProva = texto.match(
            /PROVAS\s+MÚLTIPLA ESCOLHA\s+(\d{2}\/\d{2}\/\d{4})/i
        )

        if (!primeiraProva) {
            throw new Error(
                'Não foi possível encontrar a data da primeira prova'
            )
        }

        const dataProva = primeiraProva[1]

        // --------------------------------------------------
        // 9. MONTA OS DADOS DA FUVEST
        // --------------------------------------------------

        const dadosFuvest = {

            vestibular: 'FUVEST',

            data_inicio_inscricao:
                converterData(dataInicio),

            data_fim_inscricao:
                converterData(dataFim),

            data_prova:
                converterData(dataProva),

            taxa: taxa,

            link_edital: linkEdital

        }

        // --------------------------------------------------
        // 10. MOSTRA OS DADOS EXTRAÍDOS
        // --------------------------------------------------

        console.log('Dados encontrados pela FUVEST:')
        console.log(dadosFuvest)

        return dadosFuvest

    } catch (erro) {

        console.error('Erro no scraping da FUVEST:')
        throw erro

    }

}

module.exports = { buscarFuvest }