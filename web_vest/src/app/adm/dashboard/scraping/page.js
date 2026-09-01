'use client';

import { useState } from 'react';
import SidebarAdm from '../../../../components/adm/SidebarAdm';
import { apiFetch } from '../../../../components/utils/api';

export default function ScrapingPage() {
    const [loading, setLoading] = useState(null);
    const [resultados, setResultados] = useState([]);

    const executarScraping = async (tipo, rota, nome) => {
        if (loading) return;

        setLoading(tipo);

        try {
            const resultado = await apiFetch(rota, {
                method: 'POST'
            });

            setResultados((anteriores) => [
                {
                    id: Date.now(),
                    nome,
                    sucesso: true,
                    dados: resultado
                },
                ...anteriores
            ]);
        } catch (e) {
            setResultados((anteriores) => [
                {
                    id: Date.now(),
                    nome,
                    sucesso: false,
                    erro: e.message
                },
                ...anteriores
            ]);

            alert(`Erro ao executar scraping: ${e.message}`);
        } finally {
            setLoading(null);
        }
    };

    const limparResultados = () => {
        setResultados([]);
    };

    const botoes = [
        {
            id: 'fuvest',
            titulo: 'FUVEST',
            descricao: 'Atualiza os dados do vestibular da FUVEST.',
            rota: '/fuvest',
            icone: '🎓'
        },
        {
            id: 'unicamp',
            titulo: 'UNICAMP',
            descricao: 'Atualiza os dados do vestibular da UNICAMP.',
            rota: '/unicamp',
            icone: '🎓'
        },
        {
            id: 'fuvest-provas',
            titulo: 'Provas FUVEST',
            descricao: 'Busca e atualiza as provas anteriores da FUVEST.',
            rota: '/fuvest/provas',
            icone: '📄'
        },
        {
            id: 'unicamp-provas',
            titulo: 'Provas UNICAMP',
            descricao: 'Busca e atualiza as provas anteriores da UNICAMP.',
            rota: '/unicamp/provas',
            icone: '📄'
        }
    ];

    return (
        <div
            className="flex min-h-screen font-sans"
            style={{
                background: 'var(--color-bg, #e5ecf6)',
                color: 'var(--color-ink, #4a698d)'
            }}
        >
            <SidebarAdm />

            <main className="flex-1 p-8 lg:p-10 overflow-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <span
                            className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
                            style={{ color: 'var(--color-blue, #629bb5)' }}
                        >
                            Painel Restrito
                        </span>

                        <h1
                            className="text-3xl font-serif font-bold leading-tight"
                            style={{
                                color: 'var(--color-blue-deep, #2b5f7a)',
                                fontFamily: '"DM Serif Text", serif'
                            }}
                        >
                            Scraping
                        </h1>

                        <p
                            className="text-sm mt-1 opacity-70"
                            style={{ color: 'var(--color-ink-light, #7a98b5)' }}
                        >
                            Busque e atualize automaticamente os dados dos vestibulares e provas.
                        </p>
                    </div>

                    {resultados.length > 0 && (
                        <button
                            onClick={limparResultados}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                                borderColor: 'var(--color-detail, #b9d8e1)',
                                color: 'var(--color-blue-dark, #3d7a9a)',
                                background: 'var(--color-card, #f4f8fc)'
                            }}
                        >
                            Limpar histórico
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
                    {botoes.map((botao) => {
                        const executando = loading === botao.id;

                        return (
                            <div
                                key={botao.id}
                                className="rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                style={{
                                    background: 'var(--color-card, #f4f8fc)',
                                    borderColor: 'var(--color-detail, #b9d8e1)'
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                            style={{
                                                background: 'rgba(61,122,154,0.1)'
                                            }}
                                        >
                                            {botao.icone}
                                        </div>

                                        <div>
                                            <h2
                                                className="text-lg font-bold"
                                                style={{
                                                    color: 'var(--color-blue-deep, #2b5f7a)'
                                                }}
                                            >
                                                {botao.titulo}
                                            </h2>

                                            <p
                                                className="text-sm mt-1 leading-relaxed"
                                                style={{
                                                    color: 'var(--color-ink-light, #7a98b5)'
                                                }}
                                            >
                                                {botao.descricao}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        executarScraping(botao.id, botao.rota, botao.titulo)
                                    }
                                    disabled={loading !== null}
                                    className="w-full mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    style={{
                                        background: 'var(--color-blue-dark, #3d7a9a)'
                                    }}
                                >
                                    {executando ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                />
                                            </svg>
                                            Executando scraping...
                                        </>
                                    ) : (
                                        <>
                                            <span>↻</span>
                                            Executar scraping
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {resultados.length > 0 && (
                    <div className="mt-8 max-w-5xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2
                                    className="text-xl font-bold"
                                    style={{
                                        color: 'var(--color-blue-deep, #2b5f7a)'
                                    }}
                                >
                                    Histórico de execuções
                                </h2>

                                <p
                                    className="text-sm mt-1 opacity-70"
                                    style={{
                                        color: 'var(--color-ink-light, #7a98b5)'
                                    }}
                                >
                                    Resultado das últimas execuções realizadas nesta sessão.
                                </p>
                            </div>
                        </div>

                        <div
                            className="rounded-2xl border overflow-hidden shadow-sm"
                            style={{
                                background: 'var(--color-card, #f4f8fc)',
                                borderColor: 'var(--color-detail, #b9d8e1)'
                            }}
                        >
                            {resultados.map((resultado, index) => (
                                <div
                                    key={resultado.id}
                                    className="px-5 py-4 border-b last:border-b-0"
                                    style={{
                                        borderColor:
                                            index === resultados.length - 1
                                                ? 'transparent'
                                                : 'var(--color-detail, #b9d8e1)'
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                                style={{
                                                    background: resultado.sucesso
                                                        ? 'rgba(32,201,151,0.12)'
                                                        : 'rgba(220,53,69,0.12)',
                                                    color: resultado.sucesso
                                                        ? '#198754'
                                                        : '#dc3545'
                                                }}
                                            >
                                                {resultado.sucesso ? '✓' : '✕'}
                                            </span>

                                            <div>
                                                <p
                                                    className="text-sm font-bold"
                                                    style={{
                                                        color: 'var(--color-blue-deep, #2b5f7a)'
                                                    }}
                                                >
                                                    {resultado.nome}
                                                </p>

                                                <p
                                                    className="text-xs mt-0.5"
                                                    style={{
                                                        color: resultado.sucesso ? '#198754' : '#dc3545'
                                                    }}
                                                >
                                                    {resultado.sucesso
                                                        ? resultado.dados?.mensagem || 'Scraping concluído com sucesso.'
                                                        : resultado.erro}
                                                </p>
                                            </div>
                                        </div>

                                        {resultado.sucesso && resultado.dados && (
                                            <div className="flex flex-wrap gap-2">
                                                {resultado.dados.acao && (
                                                    <span
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(61,122,154,0.1)',
                                                            color: 'var(--color-blue-dark, #3d7a9a)'
                                                        }}
                                                    >
                                                        {resultado.dados.acao}
                                                    </span>
                                                )}

                                                {resultado.dados.total_encontradas !== undefined && (
                                                    <span
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(98,155,181,0.1)',
                                                            color: 'var(--color-blue-dark, #3d7a9a)'
                                                        }}
                                                    >
                                                        {resultado.dados.total_encontradas} encontradas
                                                    </span>
                                                )}

                                                {resultado.dados.inseridas !== undefined && (
                                                    <span
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(32,201,151,0.1)',
                                                            color: '#198754'
                                                        }}
                                                    >
                                                        {resultado.dados.inseridas} inseridas
                                                    </span>
                                                )}

                                                {resultado.dados.atualizadas !== undefined && (
                                                    <span
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(98,155,181,0.1)',
                                                            color: 'var(--color-blue-dark, #3d7a9a)'
                                                        }}
                                                    >
                                                        {resultado.dados.atualizadas} atualizadas
                                                    </span>
                                                )}

                                                {resultado.dados.ignoradas !== undefined && (
                                                    <span
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(255,193,7,0.12)',
                                                            color: '#997404'
                                                        }}
                                                    >
                                                        {resultado.dados.ignoradas} ignoradas
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {resultados.length === 0 && (
                    <div
                        className="mt-8 rounded-2xl border p-10 text-center max-w-5xl"
                        style={{
                            background: 'var(--color-card, #f4f8fc)',
                            borderColor: 'var(--color-detail, #b9d8e1)'
                        }}
                    >
                        <div className="text-3xl mb-3">🔄</div>

                        <p
                            className="text-sm font-semibold"
                            style={{
                                color: 'var(--color-blue-deep, #2b5f7a)'
                            }}
                        >
                            Nenhuma execução realizada
                        </p>

                        <p
                            className="text-xs mt-1 opacity-60"
                            style={{
                                color: 'var(--color-ink-light, #7a98b5)'
                            }}
                        >
                            Escolha uma das opções acima para iniciar um scraping.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}