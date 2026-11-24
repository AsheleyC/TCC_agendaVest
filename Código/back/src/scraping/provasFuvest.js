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
                console.log(
                    'Aguardando 5 segundos para tentar novamente...'
                )

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
            links.push({
                texto,
                url: new URL(href, url).href
            })
        } catch (erro) {
            console.log(
                `URL inválida ignorada: ${href}`
            )
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
        texto.includes('resposta')
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
        'vestibular indigena',
        'indigena',
        'vagas remanescentes',
        'vagas olimpicas',
        'enem',
        'provao paulista',
        'provacao paulista',
        'estatisticas',
        'estatistica',
        'calendario',
        'habilidades especificas',
        'musica',
        'transferencia',
        'cotas',
        'isencao'
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

    if (
        url.includes('facebook.com') ||
        url.includes('instagram.com') ||
        url.includes('youtube.com')
    ) {
        return true
    }

    return false
}

function ehProva(item) {
    if (!ehPDF(item)) {
        return false
    }

    if (ehLinkIndesejado(item)) {
        return false
    }

    if (ehGabarito(item)) {
        return false
    }

    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    return (
        texto.includes('prova') ||
        texto.includes('questoes') ||
        texto.includes('questao') ||
        texto.includes('caderno') ||
        texto.includes('fase1') ||
        texto.includes('fase2') ||
        texto.includes('f1') ||
        texto.includes('f2')
    )
}

function ehGabaritoValido(item) {
    if (!ehPDF(item)) {
        return false
    }

    if (ehLinkIndesejado(item)) {
        return false
    }

    return ehGabarito(item)
}

function calcularPontuacaoProva(item, fase, ano) {
    if (!ehProva(item)) {
        return -1000
    }

    const texto = normalizarTexto(
        `${item.texto} ${item.url}`
    )

    let pontos = 0

    pontos += 100

    if (
        texto.includes(`fuvest ${ano}`) ||
        texto.includes(`fuvest${ano}`) ||
        texto.includes(`fuvest_${ano}`)
    ) {
        pontos += 100
    }

    if (texto.includes(String(ano))) {
        pontos += 30
    }

    if (
        texto.includes('prova') ||
        texto.includes('questoes') ||
        texto.includes('questao') ||
        texto.includes('caderno')
    ) {
        pontos += 30
    }

    const faseEncontrada =
        identificarFase(item)

    if (faseEncontrada === fase) {
        pontos += 150
    }

    if (
        faseEncontrada &&
        faseEncontrada !== fase
    ) {
        pontos -= 300
    }

    return pontos
}

function escolherMelhorProva(
    links,
    fase,
    ano
) {
    const candidatos =
        links
            .filter(item =>
                ehProva(item)
            )
            .map(item => ({
                item,
                pontos:
                    calcularPontuacaoProva(
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

    if (
        candidatos.length === 0
    ) {
        return null
    }

    return candidatos[0].item
}

function calcularPontuacaoGabarito(
    item,
    fase,
    ano
) {
    if (!ehGabaritoValido(item)) {
        return -1000
    }

    const texto =
        normalizarTexto(
            `${item.texto} ${item.url}`
        )

    let pontos = 0

    pontos += 100

    if (
        texto.includes('gabarito')
    ) {
        pontos += 150
    }

    if (
        texto.includes(`fuvest ${ano}`) ||
        texto.includes(`fuvest${ano}`) ||
        texto.includes(`fuvest_${ano}`)
    ) {
        pontos += 100
    }

    if (
        texto.includes(String(ano))
    ) {
        pontos += 30
    }

    const faseEncontrada =
        identificarFase(item)

    if (
        faseEncontrada === fase
    ) {
        pontos += 150
    }

    if (
        faseEncontrada &&
        faseEncontrada !== fase
    ) {
        pontos -= 300
    }

    return pontos
}

function escolherMelhorGabarito(
    links,
    fase,
    ano
) {
    const candidatos =
        links
            .filter(item =>
                ehGabaritoValido(item)
            )
            .map(item => ({
                item,
                pontos:
                    calcularPontuacaoGabarito(
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

    if (
        candidatos.length === 0
    ) {
        return null
    }

    return candidatos[0].item
}

function criarResultado(
    ano,
    fase,
    prova,
    gabarito
) {
    if (
        !prova ||
        !gabarito
    ) {
        return null
    }

    if (
        !prova.url ||
        !gabarito.url
    ) {
        return null
    }

    return {
        ano_prova: ano,
        link_prova: prova.url,
        link_gabarito: gabarito.url,
        fase
    }
}

async function buscarProvaFuvest(
    url,
    ano
) {
    try {
        console.log(
            `Buscando provas da FUVEST ${ano}...`
        )

        const html =
            await buscarPagina(url)

        const $ =
            cheerio.load(html)

        const links =
            encontrarLinks(
                $,
                url
            )

        const resultados = []

        for (
            const fase of [
                '1ª fase',
                '2ª fase'
            ]
        ) {
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

            if (
                prova &&
                gabarito
            ) {
                const resultado =
                    criarResultado(
                        ano,
                        fase,
                        prova,
                        gabarito
                    )

                if (resultado) {
                    resultados.push(
                        resultado
                    )

                    console.log(
                        `Prova encontrada para ${ano} - ${fase}`
                    )

                    console.log(
                        `Gabarito encontrado para ${ano} - ${fase}`
                    )
                }
            } else if (prova) {
                console.log(
                    `Prova encontrada para ${ano} - ${fase}, mas o gabarito não foi encontrado.`
                )

                console.log(
                    'Resultado não será adicionado.'
                )
            }
        }

        return resultados
    } catch (erro) {
        console.log(
            `Não foi possível buscar a FUVEST ${ano}: ${erro.message}`
        )

        return []
    }
}

async function buscarProvasFuvest() {
    const urlPrincipal =
        'https://www.fuvest.br/acervo-vestibular'

    try {
        console.log(
            'Acessando o acervo da FUVEST...'
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

        const anos = []

        for (
            const link of links
        ) {
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

            for (
                const valor of matches
            ) {
                const ano =
                    Number(valor)

                if (
                    ano >= 2005 &&
                    ano <=
                    new Date().getFullYear()
                ) {
                    anos.push(ano)
                }
            }
        }

        const anosUnicos =
            [...new Set(anos)]
                .sort((a, b) =>
                    b - a
                )

        console.log(
            `${anosUnicos.length} anos encontrados no acervo`
        )

        const paginas = []

        for (
            const ano of anosUnicos
        ) {
            const pagina =
                links.find(link => {
                    const texto =
                        normalizarTexto(
                            `${link.texto} ${link.url}`
                        )

                    return (
                        texto.includes(
                            `acervo vestibular ${ano}`
                        ) ||
                        texto.includes(
                            `acervo vestibular-${ano}`
                        ) ||
                        texto.includes(
                            `acervo-vestibular-${ano}`
                        ) ||
                        link.url.includes(
                            `acervo-vestibular-${ano}`
                        )
                    )
                })

            if (pagina) {
                paginas.push({
                    ano,
                    url: pagina.url
                })
            } else {
                paginas.push({
                    ano,
                    url:
                        `https://www.fuvest.br/acervo-vestibular-${ano}/`
                })
            }
        }

        const provas = []

        for (
            const pagina of paginas
        ) {
            console.log(
                `Buscando provas da FUVEST ${pagina.ano}...`
            )

            const dados =
                await buscarProvaFuvest(
                    pagina.url,
                    pagina.ano
                )

            for (
                const prova of dados
            ) {
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
                    provas.some(
                        item =>
                            item.ano_prova ===
                            prova.ano_prova &&
                            item.fase ===
                            prova.fase
                    )

                if (!jaExiste) {
                    provas.push(
                        prova
                    )
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
                'Não foi possível encontrar provas da FUVEST com gabaritos'
            )
        }

        return provas
    } catch (erro) {
        console.error(
            'Erro no scraping das provas da FUVEST:'
        )

        console.error(erro)

        throw erro
    }
}

module.exports = {
    buscarProvasFuvest
}