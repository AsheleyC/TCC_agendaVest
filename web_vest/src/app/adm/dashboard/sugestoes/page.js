'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../../components/adm/SidebarAdm';
import { apiFetch } from '../../../../components/utils/api';

export default function SugestoesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSugestoes = async () => {
        setLoading(true);

        try {
            const resposta = await apiFetch('/verSugestoes');

            setData(resposta?.sugestoes || []);
        } catch (e) {
            alert(`Erro ao carregar sugestões: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSugestoes();
    }, []);

    const handleDelete = async (id) => {
        const confirmar = confirm(
            'Deseja realmente remover esta sugestão?'
        );

        if (!confirmar) {
            return;
        }

        try {
            await apiFetch(`/delSugestao/${id}`, {
                method: 'DELETE'
            });

            await fetchSugestoes();
        } catch (e) {
            alert(`Erro ao remover sugestão: ${e.message}`);
        }
    };

    return (
        <div
            className="flex min-h-screen font-sans"
            style={{
                background: 'var(--color-bg, #e5ecf6)',
                color: 'var(--color-ink, #4a698d)'
            }}
        >
            <SidebarAdm />

            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-auto">
                {/* CABEÇALHO */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <span
                            className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
                            style={{
                                color: 'var(--color-blue, #629bb5)'
                            }}
                        >
                            Painel Restrito
                        </span>

                        <h1
                            className="text-2xl sm:text-3xl font-serif font-bold leading-tight"
                            style={{
                                color: 'var(--color-blue-deep, #2b5f7a)',
                                fontFamily: '"DM Serif Text", serif'
                            }}
                        >
                            Sugestões dos Usuários
                        </h1>

                        <p
                            className="text-sm mt-1 opacity-70 max-w-2xl"
                            style={{
                                color: 'var(--color-ink-light, #7a98b5)'
                            }}
                        >
                            Visualize vestibulares e cursos sugeridos pelos usuários
                            do AgendaVest.
                        </p>
                    </div>
                </div>

                {loading ? (
                    /* CARREGANDO */
                    <div
                        className="flex items-center gap-3 text-sm opacity-60"
                        style={{
                            color: 'var(--color-ink-light, #7a98b5)'
                        }}
                    >
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

                        Carregando sugestões...
                    </div>
                ) : data.length === 0 ? (
                    /* NENHUMA SUGESTÃO */
                    <div
                        className="rounded-2xl border py-16 px-5 text-center shadow-sm"
                        style={{
                            background: 'var(--color-card, #f4f8fc)',
                            borderColor: 'var(--color-detail, #b9d8e1)'
                        }}
                    >
                        <p
                            className="text-sm font-semibold"
                            style={{
                                color: 'var(--color-blue-deep, #2b5f7a)'
                            }}
                        >
                            Nenhuma sugestão recebida.
                        </p>

                        <p
                            className="text-xs mt-1"
                            style={{
                                color: 'var(--color-ink-light, #7a98b5)'
                            }}
                        >
                            Quando um usuário enviar uma sugestão pelo aplicativo,
                            ela aparecerá aqui.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ============================= */}
                        {/* DESKTOP                       */}
                        {/* ============================= */}

                        <div
                            className="hidden lg:block rounded-2xl border overflow-hidden shadow-sm"
                            style={{
                                background: 'var(--color-card, #f4f8fc)',
                                borderColor: 'var(--color-detail, #b9d8e1)'
                            }}
                        >
                            {/* HEADER */}
                            <div
                                className="grid items-center text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3.5 border-b"
                                style={{
                                    gridTemplateColumns:
                                        '60px minmax(130px, 1fr) minmax(180px, 1.4fr) 130px minmax(180px, 2fr) 100px',
                                    borderColor: 'var(--color-detail, #b9d8e1)',
                                    color: 'var(--color-ink-light, #7a98b5)',
                                    background: 'rgba(98,155,181,0.06)'
                                }}
                            >
                                <span>ID</span>
                                <span>Usuário</span>
                                <span>E-mail</span>
                                <span>Tipo</span>
                                <span>Sugestão</span>
                                <span className="text-right">
                                    Ações
                                </span>
                            </div>

                            {/* BODY */}
                            {data.map((item, i) => {
                                const tipo = item.vest_sugestao
                                    ? 'Vestibular'
                                    : 'Curso';

                                const sugestao =
                                    item.vest_sugestao ||
                                    item.curso_sugestao;

                                return (
                                    <div
                                        key={item.id_sugestao}
                                        className="grid items-center px-5 py-4 border-b transition-colors duration-150 hover:bg-[rgba(98,155,181,0.05)]"
                                        style={{
                                            gridTemplateColumns:
                                                '60px minmax(130px, 1fr) minmax(180px, 1.4fr) 130px minmax(180px, 2fr) 100px',
                                            borderColor:
                                                i === data.length - 1
                                                    ? 'transparent'
                                                    : 'var(--color-detail, #b9d8e1)'
                                        }}
                                    >
                                        {/* ID */}
                                        <span
                                            className="font-mono text-xs font-bold opacity-40"
                                            style={{
                                                color: 'var(--color-ink, #4a698d)'
                                            }}
                                        >
                                            {item.id_sugestao}
                                        </span>

                                        {/* USUÁRIO */}
                                        <span
                                            className="font-semibold text-sm pr-3 break-words"
                                            style={{
                                                color: 'var(--color-blue-deep, #2b5f7a)'
                                            }}
                                        >
                                            {item.nome_usuario}
                                        </span>

                                        {/* EMAIL */}
                                        <span
                                            className="text-xs break-all pr-4"
                                            style={{
                                                color: 'var(--color-ink-light, #7a98b5)'
                                            }}
                                        >
                                            {item.email}
                                        </span>

                                        {/* TIPO */}
                                        <span
                                            className="inline-flex items-center text-xs font-bold w-fit px-2.5 py-1 rounded-full"
                                            style={{
                                                background:
                                                    tipo === 'Vestibular'
                                                        ? 'rgba(43,95,122,0.10)'
                                                        : 'rgba(98,155,181,0.15)',
                                                color: 'var(--color-blue-deep, #2b5f7a)'
                                            }}
                                        >
                                            {tipo}
                                        </span>

                                        {/* SUGESTÃO */}
                                        <span
                                            className="text-sm font-medium break-words pr-3"
                                            style={{
                                                color: 'var(--color-ink, #4a698d)'
                                            }}
                                        >
                                            {sugestao}
                                        </span>

                                        {/* AÇÕES */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id_sugestao)
                                                }
                                                className="text-xs font-semibold hover:underline transition-colors"
                                                style={{
                                                    color: 'var(--vermelho, #B74A4A)'
                                                }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ============================= */}
                        {/* MOBILE / TABLET               */}
                        {/* ============================= */}

                        <div className="lg:hidden flex flex-col gap-4">
                            {data.map((item) => {
                                const tipo = item.vest_sugestao
                                    ? 'Vestibular'
                                    : 'Curso';

                                const sugestao =
                                    item.vest_sugestao ||
                                    item.curso_sugestao;

                                return (
                                    <div
                                        key={item.id_sugestao}
                                        className="rounded-2xl border p-4 sm:p-5 shadow-sm"
                                        style={{
                                            background: 'var(--color-card, #f4f8fc)',
                                            borderColor: 'var(--color-detail, #b9d8e1)'
                                        }}
                                    >
                                        {/* TOPO DO CARD */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p
                                                    className="font-semibold text-base break-words"
                                                    style={{
                                                        color: 'var(--color-blue-deep, #2b5f7a)'
                                                    }}
                                                >
                                                    {item.nome_usuario}
                                                </p>

                                                <p
                                                    className="text-xs mt-1 break-all"
                                                    style={{
                                                        color: 'var(--color-ink-light, #7a98b5)'
                                                    }}
                                                >
                                                    {item.email}
                                                </p>
                                            </div>

                                            <span
                                                className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                                                style={{
                                                    background:
                                                        tipo === 'Vestibular'
                                                            ? 'rgba(43,95,122,0.10)'
                                                            : 'rgba(98,155,181,0.15)',
                                                    color: 'var(--color-blue-deep, #2b5f7a)'
                                                }}
                                            >
                                                {tipo}
                                            </span>
                                        </div>

                                        {/* SUGESTÃO */}
                                        <div
                                            className="mt-4 pt-4 border-t"
                                            style={{
                                                borderColor: 'var(--color-detail, #b9d8e1)'
                                            }}
                                        >
                                            <p
                                                className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5"
                                                style={{
                                                    color: 'var(--color-ink-light, #7a98b5)'
                                                }}
                                            >
                                                Sugestão
                                            </p>

                                            <p
                                                className="text-sm font-medium break-words"
                                                style={{
                                                    color: 'var(--color-ink, #4a698d)'
                                                }}
                                            >
                                                {sugestao}
                                            </p>
                                        </div>

                                        {/* RODAPÉ */}
                                        <div
                                            className="flex items-center justify-between mt-4 pt-3 border-t"
                                            style={{
                                                borderColor: 'rgba(185,216,225,0.5)'
                                            }}
                                        >
                                            <span
                                                className="text-[10px] font-mono opacity-40"
                                                style={{
                                                    color: 'var(--color-ink, #4a698d)'
                                                }}
                                            >
                                                ID #{item.id_sugestao}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id_sugestao)
                                                }
                                                className="text-xs font-semibold hover:underline transition-colors"
                                                style={{
                                                    color: 'var(--vermelho, #B74A4A)'
                                                }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}