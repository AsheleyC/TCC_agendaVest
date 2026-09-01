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
                throw new Error(`Erro ao acessar a página: ${resposta.status}`)
            }

            console.log('Página acessada com sucesso!')

            return await resposta.text()
        } catch (erro) {
            ultimoErro = erro

            console.log(`Tentativa ${tentativa} falhou: ${erro.message}`)

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

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function encontrarLinks($, url) {
    const links = []

    $('a').each((index, elemento) => {
        const texto = $(elemento)
            .text()
            .replace(/\s+/g, ' ')
            .trim()

        const href = $(elemento).attr('href')

        if (!href) {
            return
        }

        try {
            const urlCompleta = new URL(href, url).href

            if (!links.some(item => item.url === urlCompleta)) {
                links.push({
                    texto,
                    url: urlCompleta
                })
            }
        } catch (erro) {
            console.log(`URL inválida ignorada: ${href}`)
        }
    })

    return links
}

function ehPDF(item) {
    return item.url
        .toLowerCase()
        .split('?')[0]
        .endsWith('.pdf')
}

function ehLinkExternoIndesejado(item) {
    const url = item.url.toLowerCase()

    return (
        url.includes('facebook.com') ||
        url.includes('instagram.com') ||
        url.includes('youtube.com') ||
        url.includes('twitter.com') ||
        url.includes('x.com')
    )
}

function ehLinkIndesejado(item) {
    const texto = normalizarTexto(item.texto)
    const url = normalizarTexto(item.url)

    const termosIndesejados = [
        'resultado',
        'resultados',
        'convocado',
        'convocados',
        'chamada',
        'chamadas',
        'inscricao',
        'inscricoes',
        'edital',
        'manual',
        'noticia',
        'noticias',
        'local de prova',
        'local de provas',
        'vagas remanescentes',
        'vagas olimpicas',
        'enem',
        'estatisticas',
        'estatistica',
        'calendario',
        'habilidades especificas',
        'musica',
        'transferencia',
        'cotas',
        'isencao',
        'redacao',
        'redacoes',
        'lista de aprovados',
        'lista de espera',
        'classificacao'
    ]

    if (
        termosIndesejados.some(termo =>
            texto.includes(termo)
        )
    ) {
        return true
    }

    if (
        termosIndesejados.some(termo =>
            url.includes(termo)
        )
    ) {
        return true
    }

    if (ehLinkExternoIndesejado(item)) {
        return true
    }

    return false
}

function identificarFase(item) {
    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    if (
        texto.includes('2a fase') ||
        texto.includes('2 fase') ||
        texto.includes('segunda fase') ||
        texto.includes('segunda-fase') ||
        texto.includes('segunda_fase') ||
        texto.includes('2afase') ||
        texto.includes('2a-fase') ||
        texto.includes('fase2') ||
        texto.includes('fase-2') ||
        texto.includes('fase_2') ||
        texto.includes('fase 2') ||
        texto.includes('f2')
    ) {
        return '2ª fase'
    }

    if (
        texto.includes('1a fase') ||
        texto.includes('1 fase') ||
        texto.includes('primeira fase') ||
        texto.includes('primeira-fase') ||
        texto.includes('primeira_fase') ||
        texto.includes('1afase') ||
        texto.includes('1a-fase') ||
        texto.includes('fase1') ||
        texto.includes('fase-1') ||
        texto.includes('fase_1') ||
        texto.includes('fase 1') ||
        texto.includes('f1')
    ) {
        return '1ª fase'
    }

    return null
}

function ehGabarito(item) {
    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    return (
        texto.includes('gabarito') ||
        texto.includes('gabaritos') ||
        texto.includes('respostas') ||
        texto.includes('resposta') ||
        texto.includes('resolucao') ||
        texto.includes('resolucoes')
    )
}

function ehProva(item) {
    if (ehLinkIndesejado(item)) {
        return false
    }

    if (ehGabarito(item)) {
        return false
    }

    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    const termosProva = [
        'prova',
        'provas',
        'questoes',
        'questao',
        'caderno',
        'caderno de questoes',
        'caderno questoes',
        'questionario'
    ]

    return termosProva.some(termo =>
        texto.includes(termo)
    )
}

function ehGabaritoValido(item) {
    if (ehLinkIndesejado(item)) {
        return false
    }

    return ehGabarito(item)
}

function contemAno(item, ano) {
    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    return (
        texto.includes(String(ano)) ||
        texto.includes(`unicamp ${ano}`) ||
        texto.includes(`unicamp${ano}`) ||
        texto.includes(`vestibular ${ano}`) ||
        texto.includes(`vestibular${ano}`)
    )
}

function pontuarFase(texto, fase) {
    if (fase === '1ª fase') {
        if (
            texto.includes('1a fase') ||
            texto.includes('1 fase') ||
            texto.includes('primeira fase') ||
            texto.includes('primeira-fase') ||
            texto.includes('primeira_fase') ||
            texto.includes('1afase') ||
            texto.includes('1a-fase') ||
            texto.includes('fase1') ||
            texto.includes('fase-1') ||
            texto.includes('fase_1') ||
            texto.includes('fase 1') ||
            texto.includes('f1')
        ) {
            return 250
        }
    }

    if (fase === '2ª fase') {
        if (
            texto.includes('2a fase') ||
            texto.includes('2 fase') ||
            texto.includes('segunda fase') ||
            texto.includes('segunda-fase') ||
            texto.includes('segunda_fase') ||
            texto.includes('2afase') ||
            texto.includes('2a-fase') ||
            texto.includes('fase2') ||
            texto.includes('fase-2') ||
            texto.includes('fase_2') ||
            texto.includes('fase 2') ||
            texto.includes('f2')
        ) {
            return 250
        }
    }

    return 0
}

function pontuarProva(item, fase, ano) {
    if (!ehProva(item)) {
        return -1000
    }

    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    let pontos = 0

    if (contemAno(item, ano)) {
        pontos += 100
    }

    if (texto.includes('unicamp')) {
        pontos += 80
    }

    if (texto.includes('vestibular')) {
        pontos += 50
    }

    if (texto.includes('prova')) {
        pontos += 150
    }

    if (
        texto.includes('questoes') ||
        texto.includes('questao')
    ) {
        pontos += 100
    }

    if (texto.includes('caderno')) {
        pontos += 100
    }

    pontos += pontuarFase(texto, fase)

    const faseEncontrada = identificarFase(item)

    if (
        faseEncontrada &&
        faseEncontrada !== fase
    ) {
        pontos -= 300
    }

    if (ehPDF(item)) {
        pontos += 30
    }

    return pontos
}

function pontuarGabarito(item, fase, ano) {
    if (!ehGabaritoValido(item)) {
        return -1000
    }

    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    let pontos = 0

    if (contemAno(item, ano)) {
        pontos += 100
    }

    if (texto.includes('unicamp')) {
        pontos += 80
    }

    if (texto.includes('vestibular')) {
        pontos += 50
    }

    if (texto.includes('gabarito')) {
        pontos += 250
    }

    if (
        texto.includes('resposta') ||
        texto.includes('respostas')
    ) {
        pontos += 100
    }

    pontos += pontuarFase(texto, fase)

    const faseEncontrada = identificarFase(item)

    if (
        faseEncontrada &&
        faseEncontrada !== fase
    ) {
        pontos -= 300
    }

    if (ehPDF(item)) {
        pontos += 30
    }

    return pontos
}

function escolherMelhorProva(links, fase, ano) {
    const candidatos = links
        .filter(item => ehProva(item))
        .map(item => ({
            item,
            pontos: pontuarProva(
                item,
                fase,
                ano
            )
        }))
        .filter(item =>
            item.pontos > 0
        )
        .sort((a, b) =>
            b.pontos - a.pontos
        )

    if (candidatos.length === 0) {
        return null
    }

    console.log(
        `Melhor prova ${ano} - ${fase}:`,
        candidatos[0].item.texto,
        candidatos[0].item.url,
        `(${candidatos[0].pontos} pontos)`
    )

    return candidatos[0].item
}

function escolherMelhorGabarito(links, fase, ano) {
    const candidatos = links
        .filter(item => ehGabaritoValido(item))
        .map(item => ({
            item,
            pontos: pontuarGabarito(
                item,
                fase,
                ano
            )
        }))
        .filter(item =>
            item.pontos > 0
        )
        .sort((a, b) =>
            b.pontos - a.pontos
        )

    if (candidatos.length === 0) {
        return null
    }

    console.log(
        `Melhor gabarito ${ano} - ${fase}:`,
        candidatos[0].item.texto,
        candidatos[0].item.url,
        `(${candidatos[0].pontos} pontos)`
    )

    return candidatos[0].item
}

function criarResultado(
    ano,
    fase,
    prova,
    gabarito
) {
    if (!prova || !gabarito) {
        return null
    }

    if (!prova.url || !gabarito.url) {
        return null
    }

    return {
        ano_prova: ano,
        link_prova: prova.url,
        link_gabarito: gabarito.url,
        fase
    }
}

async function buscarProvaUnicamp(url, ano) {
    try {
        console.log(
            `Buscando provas da UNICAMP ${ano}...`
        )

        const html =
            await buscarPagina(url)

        const $ =
            cheerio.load(html)

        const links =
            encontrarLinks($, url)

        console.log(
            `${links.length} links encontrados na página da UNICAMP ${ano}`
        )

        const pdfs =
            links.filter(item =>
                ehPDF(item)
            )

        console.log(
            `${pdfs.length} PDFs encontrados na página da UNICAMP ${ano}`
        )

        const resultados = []

        for (
            const fase of [
                '1ª fase',
                '2ª fase'
            ]
        ) {
            console.log(
                `Procurando ${fase} da UNICAMP ${ano}...`
            )

            const prova =
                escolherMelhorProva(
                    links,
                    fase,
                    ano
                )

            const gabarito =
                escolherMelhorGabarito(
                    links,
                    fase,
                    ano
                )

            if (prova) {
                console.log(
                    `Prova candidata encontrada para ${ano} - ${fase}: ${prova.url}`
                )
            } else {
                console.log(
                    `Nenhuma prova encontrada para ${ano} - ${fase}`
                )
            }

            if (gabarito) {
                console.log(
                    `Gabarito candidato encontrado para ${ano} - ${fase}: ${gabarito.url}`
                )
            } else {
                console.log(
                    `Nenhum gabarito encontrado para ${ano} - ${fase}`
                )
            }

            if (prova && gabarito) {
                const resultado =
                    criarResultado(
                        ano,
                        fase,
                        prova,
                        gabarito
                    )

                if (resultado) {
                    resultados.push(resultado)

                    console.log(
                        `Prova completa encontrada para ${ano} - ${fase}`
                    )
                }
            } else {
                console.log(
                    `Não foi encontrada prova completa para ${ano} - ${fase}`
                )
            }
        }

        return resultados
    } catch (erro) {
        console.log(
            `Não foi possível buscar a UNICAMP ${ano}: ${erro.message}`
        )

        return []
    }
}

function encontrarAnos(links) {
    const anos = []

    for (const link of links) {
        const texto =
            normalizarTexto(
                `${link.texto} ${link.url}`
            )

        const matches =
            texto.match(
                /\b(20\d{2})\b/g
            )

        if (!matches) {
            continue
        }

        for (const valor of matches) {
            const ano =
                Number(valor)

            if (
                ano >= 2000 &&
                ano <=
                new Date().getFullYear()
            ) {
                anos.push(ano)
            }
        }
    }

    return [
        ...new Set(anos)
    ].sort((a, b) => b - a)
}

function encontrarPaginaAno(links, ano) {
    const candidatos = []

    for (const link of links) {
        const texto =
            normalizarTexto(
                `${link.texto} ${link.url}`
            )

        if (
            !texto.includes(String(ano))
        ) {
            continue
        }

        let pontos = 0

        if (
            texto.includes(
                `ingresso ${ano}`
            )
        ) {
            pontos += 200
        }

        if (
            texto.includes(
                `ingresso-${ano}`
            )
        ) {
            pontos += 200
        }

        if (
            texto.includes(
                `vestibular ${ano}`
            )
        ) {
            pontos += 150
        }

        if (
            texto.includes(
                `vestibular-${ano}`
            )
        ) {
            pontos += 150
        }

        if (
            link.url.includes(
                `ingresso-${ano}`
            )
        ) {
            pontos += 200
        }

        if (
            link.url.includes(
                `vestibular-${ano}`
            )
        ) {
            pontos += 150
        }

        if (
            link.url.includes(
                `/ingresso-${ano}/`
            )
        ) {
            pontos += 250
        }

        if (ehPDF(link)) {
            pontos -= 100
        }

        if (pontos > 0) {
            candidatos.push({
                link,
                pontos
            })
        }
    }

    candidatos.sort((a, b) =>
        b.pontos - a.pontos
    )

    if (
        candidatos.length > 0
    ) {
        return candidatos[0].link
    }

    return null
}

async function buscarProvasUnicamp() {
    const urlPrincipal =
        'https://www.comvest.unicamp.br/vestibulares-anteriores/'

    try {
        console.log(
            'Acessando o acervo da UNICAMP...'
        )

        const html =
            await buscarPagina(
                urlPrincipal
            )

        const $ =
            cheerio.load(html)

        const links =
            encontrarLinks(
                $,
                urlPrincipal
            )

        console.log(
            `${links.length} links encontrados no acervo da UNICAMP`
        )

        const anos =
            encontrarAnos(links)

        console.log(
            `${anos.length} anos encontrados no acervo`
        )

        const paginas = []

        for (const ano of anos) {
            const pagina =
                encontrarPaginaAno(
                    links,
                    ano
                )

            if (pagina) {
                paginas.push({
                    ano,
                    url: pagina.url
                })

                console.log(
                    `Página encontrada para ${ano}: ${pagina.url}`
                )
            } else {
                console.log(
                    `Página específica não encontrada para ${ano}`
                )
            }
        }

        const provas = []

        for (const pagina of paginas) {
            console.log(
                `Buscando provas da UNICAMP ${pagina.ano}...`
            )

            const dados =
                await buscarProvaUnicamp(
                    pagina.url,
                    pagina.ano
                )

            for (const prova of dados) {
                if (
                    !prova ||
                    !prova.link_prova ||
                    !prova.link_gabarito ||
                    !prova.ano_prova ||
                    !prova.fase
                ) {
                    continue
                }

                const jaExiste =
                    provas.some(item =>
                        item.ano_prova ===
                        prova.ano_prova &&
                        item.fase ===
                        prova.fase
                    )

                if (!jaExiste) {
                    provas.push(prova)
                }
            }
        }

        provas.sort((a, b) => {
            if (
                b.ano_prova !==
                a.ano_prova
            ) {
                return (
                    b.ano_prova -
                    a.ano_prova
                )
            }

            return a.fase.localeCompare(
                b.fase
            )
        })

        console.log(
            'Provas encontradas:'
        )

        console.log(provas)

        if (
            provas.length === 0
        ) {
            throw new Error(
                'Não foi possível encontrar provas da UNICAMP com gabaritos'
            )
        }

        return provas
    } catch (erro) {
        console.error(
            'Erro no scraping das provas da UNICAMP:'
        )

        console.error(erro)

        throw erro
    }
}

module.exports = {
    buscarProvasUnicamp
}