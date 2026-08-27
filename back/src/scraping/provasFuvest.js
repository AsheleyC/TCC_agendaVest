const cheerio = require('cheerio')

async function buscarPagina(url, tentativas = 3) {

    let ultimoErro

    for (let tentativa = 1; tentativa <= tentativas; tentativa++) {

        try {

            console.log(`Tentando acessar: ${url}`)
            console.log(`Tentativa ${tentativa} de ${tentativas}`)

            const resposta = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            })

            if (!resposta.ok) {
                throw new Error(
                    `Erro ao acessar a página: ${resposta.status}`
                )
            }

            console.log('Página acessada com sucesso!')

            return await resposta.text()

        } catch (erro) {

            ultimoErro = erro

            console.log(
                `Tentativa ${tentativa} falhou: ${erro.message}`
            )

            if (tentativa < tentativas) {

                console.log('Aguardando 5 segundos para tentar novamente...')

                await new Promise(resolve =>
                    setTimeout(resolve, 5000)
                )

            }

        }

    }

    throw ultimoErro

}

async function buscarLinksDaPagina(url, ano) {

    const html = await buscarPagina(url)

    const $ = cheerio.load(html)

    let linkProva = null
    let linkGabarito = null

    $('a').each((index, elemento) => {

        const textoLink = $(elemento)
            .text()
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()

        const href = $(elemento).attr('href')

        if (!href) {
            return
        }

        const linkCompleto = new URL(href, url).href

        if (
            !linkProva &&
            textoLink.includes('prova') &&
            !textoLink.includes('gabarito') &&
            !textoLink.includes('segunda fase') &&
            !textoLink.includes('2ª fase') &&
            !textoLink.includes('resposta')
        ) {

            linkProva = linkCompleto

        }

        if (
            !linkGabarito &&
            textoLink.includes('gabarito')
        ) {

            linkGabarito = linkCompleto

        }

    })

    if (!linkProva && !linkGabarito) {
        return null
    }

    return {
        ano_prova: ano,
        link_prova: linkProva,
        link_gabarito: linkGabarito
    }

}

async function buscarProvasFuvest() {

    const urlAcervo = 'https://www.fuvest.br/acervo-vestibular'

    try {

        console.log('Acessando o acervo da FUVEST...')

        const html = await buscarPagina(urlAcervo)

        const $ = cheerio.load(html)

        const linksAnos = []

        $('a').each((index, elemento) => {

            const textoLink = $(elemento)
                .text()
                .trim()

            const href = $(elemento).attr('href')

            if (
                href &&
                /^\d{4}$/.test(textoLink)
            ) {

                const ano = Number(textoLink)

                if (
                    ano >= 2005 &&
                    ano <= new Date().getFullYear()
                ) {

                    linksAnos.push({
                        ano,
                        url: new URL(href, urlAcervo).href
                    })

                }

            }

        })

        const anosUnicos = []
        const anosAdicionados = new Set()

        for (const item of linksAnos) {

            if (!anosAdicionados.has(item.ano)) {

                anosAdicionados.add(item.ano)

                anosUnicos.push(item)

            }

        }

        console.log(`${anosUnicos.length} anos encontrados no acervo`)

        const provas = []

        for (const item of anosUnicos) {

            try {

                console.log(
                    `Buscando prova e gabarito da FUVEST ${item.ano}...`
                )

                const dadosProva = await buscarLinksDaPagina(
                    item.url,
                    item.ano
                )

                if (dadosProva) {

                    provas.push(dadosProva)

                    console.log(
                        `Dados encontrados para ${item.ano}`
                    )

                }

            } catch (erro) {

                console.log(
                    `Não foi possível buscar os dados da FUVEST ${item.ano}`
                )

            }

        }

        console.log('Provas encontradas:')
        console.log(provas)

        return provas

    } catch (erro) {

        console.error('Erro no scraping das provas da FUVEST:')
        console.error(erro)

        throw erro

    }

}



module.exports = { buscarProvasFuvest }