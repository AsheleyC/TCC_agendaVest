'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../../components/adm/SidebarAdm';
import { apiFetch } from '../../../../components/utils/api';

export default function SugestoesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pesquisa, setPesquisa] = useState('');
    const [atualizandoStatus, setAtualizandoStatus] = useState(null);

    const itensPorPagina = 8;

    const fetchSugestoes = async () => {
        setLoading(true);

        try {
            const resposta = await apiFetch('/verSugestoes');

            setData(resposta?.sugestoes || []);
            setPaginaAtual(1);
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

    const handleStatus = async (id, novoStatus) => {
        setAtualizandoStatus(id);

        try {
            await apiFetch(`/atualStatusSugestao/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    status_sugestao: novoStatus
                })
            });

            setData((dadosAtuais) =>
                dadosAtuais.map((item) =>
                    item.id_sugestao === id
                        ? {
                            ...item,
                            status_sugestao: novoStatus
                        }
                        : item
                )
            );
        } catch (e) {
            alert(`Erro ao atualizar status: ${e.message}`);
        } finally {
            setAtualizandoStatus(null);
        }
    };

    const textoStatus = (status) => {
        switch (status) {
            case 'considerada':
                return 'Considerada';

            case 'nao_considerada':
                return 'Não será considerada';

            default:
                return 'Ainda não considerada';
        }
    };

    const estiloStatus = (status) => {
        switch (status) {
            case 'considerada':
                return {
                    background: 'rgba(72, 148, 99, 0.12)',
                    color: '#3f7d55'
                };

            case 'nao_considerada':
                return {
                    background: 'rgba(183, 74, 74, 0.12)',
                    color: 'var(--vermelho, #B74A4A)'
                };

            default:
                return {
                    background: 'rgba(196, 151, 45, 0.13)',
                    color: '#8c6b1f'
                };
        }
    };

    const iconeStatus = (status) => {
        switch (status) {
            case 'considerada':
                return 'fa fa-check-circle';

            case 'nao_considerada':
                return 'fa fa-times-circle';

            default:
                return 'fa fa-clock-o';
        }
    };

    const dadosFiltrados = data.filter((item) => {
        const termo = pesquisa.trim().toLowerCase();

        if (!termo) {
            return true;
        }

        const tipo = item.vest_sugestao
            ? 'vestibular'
            : 'curso';

        const sugestao =
            item.vest_sugestao ||
            item.curso_sugestao ||
            '';

        const statusTexto = textoStatus(
            item.status_sugestao || 'pendente'
        ).toLowerCase();

        return (
            item.nome_usuario
                ?.toLowerCase()
                .includes(termo) ||

            item.email
                ?.toLowerCase()
                .includes(termo) ||

            sugestao
                .toLowerCase()
                .includes(termo) ||

            tipo.includes(termo) ||

            statusTexto.includes(termo) ||

            String(item.id_sugestao || '')
                .includes(termo)
        );
    });

    const totalPaginas = Math.ceil(
        dadosFiltrados.length / itensPorPagina
    );

    const indiceInicial =
        (paginaAtual - 1) * itensPorPagina;

    const indiceFinal =
        indiceInicial + itensPorPagina;

    const sugestoesPaginadas = dadosFiltrados.slice(
        indiceInicial,
        indiceFinal
    );

    const mudarPagina = (pagina) => {
        if (
            pagina < 1 ||
            pagina > totalPaginas
        ) {
            return;
        }

        setPaginaAtual(pagina);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

            <main className="flex-1 min-w-0 px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pb-10 lg:pt-24 overflow-auto">

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
                            Visualize vestibulares e cursos sugeridos pelos usuários do AgendaVest.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div
                        className="flex items-center gap-3 text-sm opacity-60"
                        style={{
                            color: 'var(--color-ink-light, #7a98b5)'
                        }}
                    >
                        <i
                            className="fa fa-spinner fa-spin"
                            aria-hidden="true"
                        />

                        Carregando sugestões...
                    </div>
                ) : (
                    <>

                        {/* PESQUISA */}
                        <div className="mb-5">
                            <div className="relative w-full max-w-md">

                                <i
                                    className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                                    aria-hidden="true"
                                    style={{
                                        color: 'var(--color-ink-light, #7a98b5)'
                                    }}
                                />

                                <input
                                    type="text"
                                    value={pesquisa}
                                    onChange={(e) => {
                                        setPesquisa(e.target.value);
                                        setPaginaAtual(1);
                                    }}
                                    placeholder="Pesquisar usuário, sugestão ou status..."
                                    className="w-full rounded-xl border py-3 pl-11 pr-10 text-sm outline-none transition-all duration-200 focus:ring-2"
                                    style={{
                                        background: 'var(--color-card, #f4f8fc)',
                                        borderColor: 'var(--color-detail, #b9d8e1)',
                                        color: 'var(--color-ink, #4a698d)'
                                    }}
                                />

                                {pesquisa && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPesquisa('');
                                            setPaginaAtual(1);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-50 transition-opacity hover:opacity-100"
                                        aria-label="Limpar pesquisa"
                                    >
                                        <i
                                            className="fa fa-times"
                                            aria-hidden="true"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        {dadosFiltrados.length === 0 ? (
                            <div
                                className="rounded-2xl border py-16 px-5 text-center shadow-sm"
                                style={{
                                    background: 'var(--color-card, #f4f8fc)',
                                    borderColor: 'var(--color-detail, #b9d8e1)'
                                }}
                            >
                                <div
                                    className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4"
                                    style={{
                                        background: 'rgba(61,122,154,0.1)',
                                        color: 'var(--color-blue-dark, #3d7a9a)'
                                    }}
                                >
                                    <i
                                        className={
                                            pesquisa
                                                ? 'fa fa-search'
                                                : 'fa fa-lightbulb-o'
                                        }
                                        style={{
                                            fontSize: '22px'
                                        }}
                                        aria-hidden="true"
                                    />
                                </div>

                                <p
                                    className="text-sm font-semibold"
                                    style={{
                                        color: 'var(--color-blue-deep, #2b5f7a)'
                                    }}
                                >
                                    {pesquisa
                                        ? 'Nenhuma sugestão encontrada.'
                                        : 'Nenhuma sugestão recebida.'}
                                </p>

                                <p
                                    className="text-xs mt-1"
                                    style={{
                                        color: 'var(--color-ink-light, #7a98b5)'
                                    }}
                                >
                                    {pesquisa
                                        ? 'Tente pesquisar utilizando outro termo.'
                                        : 'Quando um usuário enviar uma sugestão pelo aplicativo, ela aparecerá aqui.'}
                                </p>
                            </div>
                        ) : (
                            <>

                                {/* DESKTOP */}
                                <div
                                    className="hidden lg:block rounded-2xl border overflow-hidden shadow-sm"
                                    style={{
                                        background: 'var(--color-card, #f4f8fc)',
                                        borderColor: 'var(--color-detail, #b9d8e1)'
                                    }}
                                >
                                    <div
                                        className="grid items-center text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3.5 border-b"
                                        style={{
                                            gridTemplateColumns:
                                                '55px minmax(120px, 1fr) minmax(170px, 1.3fr) 110px minmax(170px, 1.6fr) 210px 100px',

                                            borderColor:
                                                'var(--color-detail, #b9d8e1)',

                                            color:
                                                'var(--color-ink-light, #7a98b5)',

                                            background:
                                                'rgba(98,155,181,0.06)'
                                        }}
                                    >
                                        <span>ID</span>
                                        <span>Usuário</span>
                                        <span>E-mail</span>
                                        <span>Tipo</span>
                                        <span>Sugestão</span>
                                        <span>Status</span>

                                        <span className="text-right">
                                            Ações
                                        </span>
                                    </div>

                                    {sugestoesPaginadas.map((item, i) => {
                                        const tipo = item.vest_sugestao
                                            ? 'Vestibular'
                                            : 'Curso';

                                        const sugestao =
                                            item.vest_sugestao ||
                                            item.curso_sugestao;

                                        const status =
                                            item.status_sugestao ||
                                            'pendente';

                                        return (
                                            <div
                                                key={item.id_sugestao}
                                                className="grid items-center px-5 py-4 border-b transition-colors duration-200 hover:bg-[rgba(98,155,181,0.05)]"
                                                style={{
                                                    gridTemplateColumns:
                                                        '55px minmax(120px, 1fr) minmax(170px, 1.3fr) 110px minmax(170px, 1.6fr) 210px 100px',

                                                    borderColor:
                                                        i === sugestoesPaginadas.length - 1
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
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full"
                                                    style={{
                                                        background:
                                                            tipo === 'Vestibular'
                                                                ? 'rgba(43,95,122,0.10)'
                                                                : 'rgba(98,155,181,0.15)',

                                                        color:
                                                            'var(--color-blue-deep, #2b5f7a)'
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            tipo === 'Vestibular'
                                                                ? 'fa fa-graduation-cap'
                                                                : 'fa fa-book'
                                                        }
                                                        aria-hidden="true"
                                                    />

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

                                                {/* STATUS */}
                                                <div className="pr-3">
                                                    <div
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2"
                                                        style={estiloStatus(status)}
                                                    >
                                                        <i
                                                            className={iconeStatus(status)}
                                                            aria-hidden="true"
                                                        />

                                                        {textoStatus(status)}
                                                    </div>

                                                    <select
                                                        value={status}
                                                        disabled={
                                                            atualizandoStatus ===
                                                            item.id_sugestao
                                                        }
                                                        onChange={(e) =>
                                                            handleStatus(
                                                                item.id_sugestao,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full rounded-lg border px-2 py-1.5 text-[11px] outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{
                                                            background:
                                                                'var(--color-card, #f4f8fc)',
                                                            borderColor:
                                                                'var(--color-detail, #b9d8e1)',
                                                            color:
                                                                'var(--color-ink, #4a698d)'
                                                        }}
                                                    >
                                                        <option value="pendente">
                                                            Ainda não considerada
                                                        </option>

                                                        <option value="considerada">
                                                            Considerada
                                                        </option>

                                                        <option value="nao_considerada">
                                                            Não será considerada
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* AÇÕES */}
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id_sugestao
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 text-xs font-semibold hover:underline transition-colors"
                                                        style={{
                                                            color:
                                                                'var(--vermelho, #B74A4A)'
                                                        }}
                                                    >
                                                        <i
                                                            className="fa fa-trash-o"
                                                            aria-hidden="true"
                                                        />

                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* MOBILE / TABLET */}
                                <div className="lg:hidden flex flex-col gap-4">

                                    {sugestoesPaginadas.map((item) => {
                                        const tipo = item.vest_sugestao
                                            ? 'Vestibular'
                                            : 'Curso';

                                        const sugestao =
                                            item.vest_sugestao ||
                                            item.curso_sugestao;

                                        const status =
                                            item.status_sugestao ||
                                            'pendente';

                                        return (
                                            <div
                                                key={item.id_sugestao}
                                                className="rounded-2xl border p-4 sm:p-5 shadow-sm"
                                                style={{
                                                    background:
                                                        'var(--color-card, #f4f8fc)',

                                                    borderColor:
                                                        'var(--color-detail, #b9d8e1)'
                                                }}
                                            >

                                                {/* CABEÇALHO DO CARD */}
                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">
                                                        <p
                                                            className="font-semibold text-base break-words"
                                                            style={{
                                                                color:
                                                                    'var(--color-blue-deep, #2b5f7a)'
                                                            }}
                                                        >
                                                            {item.nome_usuario}
                                                        </p>

                                                        <p
                                                            className="text-xs mt-1 break-all"
                                                            style={{
                                                                color:
                                                                    'var(--color-ink-light, #7a98b5)'
                                                            }}
                                                        >
                                                            {item.email}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                                                        style={{
                                                            background:
                                                                tipo === 'Vestibular'
                                                                    ? 'rgba(43,95,122,0.10)'
                                                                    : 'rgba(98,155,181,0.15)',

                                                            color:
                                                                'var(--color-blue-deep, #2b5f7a)'
                                                        }}
                                                    >
                                                        <i
                                                            className={
                                                                tipo === 'Vestibular'
                                                                    ? 'fa fa-graduation-cap'
                                                                    : 'fa fa-book'
                                                            }
                                                            aria-hidden="true"
                                                        />

                                                        {tipo}
                                                    </span>
                                                </div>

                                                {/* SUGESTÃO */}
                                                <div
                                                    className="mt-4 pt-4 border-t"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-detail, #b9d8e1)'
                                                    }}
                                                >
                                                    <p
                                                        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5"
                                                        style={{
                                                            color:
                                                                'var(--color-ink-light, #7a98b5)'
                                                        }}
                                                    >
                                                        Sugestão
                                                    </p>

                                                    <p
                                                        className="text-sm font-medium break-words"
                                                        style={{
                                                            color:
                                                                'var(--color-ink, #4a698d)'
                                                        }}
                                                    >
                                                        {sugestao}
                                                    </p>
                                                </div>

                                                {/* STATUS */}
                                                <div
                                                    className="mt-4 pt-4 border-t"
                                                    style={{
                                                        borderColor:
                                                            'var(--color-detail, #b9d8e1)'
                                                    }}
                                                >
                                                    <p
                                                        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
                                                        style={{
                                                            color:
                                                                'var(--color-ink-light, #7a98b5)'
                                                        }}
                                                    >
                                                        Status
                                                    </p>

                                                    <div
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                                                        style={estiloStatus(status)}
                                                    >
                                                        <i
                                                            className={iconeStatus(status)}
                                                            aria-hidden="true"
                                                        />

                                                        {textoStatus(status)}
                                                    </div>

                                                    <select
                                                        value={status}
                                                        disabled={
                                                            atualizandoStatus ===
                                                            item.id_sugestao
                                                        }
                                                        onChange={(e) =>
                                                            handleStatus(
                                                                item.id_sugestao,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border px-3 py-2.5 text-xs outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{
                                                            background:
                                                                'var(--color-card, #f4f8fc)',
                                                            borderColor:
                                                                'var(--color-detail, #b9d8e1)',
                                                            color:
                                                                'var(--color-ink, #4a698d)'
                                                        }}
                                                    >
                                                        <option value="pendente">
                                                            Ainda não considerada
                                                        </option>

                                                        <option value="considerada">
                                                            Considerada
                                                        </option>

                                                        <option value="nao_considerada">
                                                            Não será considerada
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* RODAPÉ */}
                                                <div
                                                    className="flex items-center justify-between mt-4 pt-3 border-t"
                                                    style={{
                                                        borderColor:
                                                            'rgba(185,216,225,0.5)'
                                                    }}
                                                >
                                                    <span
                                                        className="text-[10px] font-mono opacity-40"
                                                        style={{
                                                            color:
                                                                'var(--color-ink, #4a698d)'
                                                        }}
                                                    >
                                                        ID #{item.id_sugestao}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id_sugestao
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 text-xs font-semibold hover:underline transition-colors"
                                                        style={{
                                                            color:
                                                                'var(--vermelho, #B74A4A)'
                                                        }}
                                                    >
                                                        <i
                                                            className="fa fa-trash-o"
                                                            aria-hidden="true"
                                                        />

                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* PAGINAÇÃO */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">

                                    <p
                                        className="text-xs"
                                        style={{
                                            color:
                                                'var(--color-ink-light, #7a98b5)'
                                        }}
                                    >
                                        Exibindo{' '}
                                        <strong>
                                            {indiceInicial + 1}
                                        </strong>
                                        {' '}até{' '}
                                        <strong>
                                            {Math.min(
                                                indiceFinal,
                                                dadosFiltrados.length
                                            )}
                                        </strong>
                                        {' '}de{' '}
                                        <strong>
                                            {dadosFiltrados.length}
                                        </strong>
                                        {' '}sugestões
                                    </p>

                                    {totalPaginas > 1 && (
                                        <div className="flex flex-wrap items-center justify-center gap-2">

                                            {/* PRIMEIRA */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    mudarPagina(1)
                                                }
                                                disabled={
                                                    paginaAtual === 1
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                style={{
                                                    color:
                                                        'var(--color-blue-deep, #2b5f7a)',

                                                    background:
                                                        'var(--color-card, #f4f8fc)',

                                                    border:
                                                        '1px solid var(--color-detail, #b9d8e1)'
                                                }}
                                            >
                                                <i
                                                    className="fa fa-angle-double-left"
                                                    aria-hidden="true"
                                                />

                                                Primeira
                                            </button>

                                            {/* ANTERIOR */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    mudarPagina(
                                                        paginaAtual - 1
                                                    )
                                                }
                                                disabled={
                                                    paginaAtual === 1
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                style={{
                                                    color:
                                                        'var(--color-blue-deep, #2b5f7a)',

                                                    background:
                                                        'var(--color-card, #f4f8fc)',

                                                    border:
                                                        '1px solid var(--color-detail, #b9d8e1)'
                                                }}
                                            >
                                                <i
                                                    className="fa fa-angle-left"
                                                    aria-hidden="true"
                                                />

                                                Anterior
                                            </button>

                                            <span
                                                className="text-xs font-semibold whitespace-nowrap"
                                                style={{
                                                    color:
                                                        'var(--color-ink-light, #7a98b5)'
                                                }}
                                            >
                                                Página {paginaAtual} de {totalPaginas}
                                            </span>

                                            {/* PRÓXIMA */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    mudarPagina(
                                                        paginaAtual + 1
                                                    )
                                                }
                                                disabled={
                                                    paginaAtual === totalPaginas
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                style={{
                                                    color:
                                                        'var(--color-blue-deep, #2b5f7a)',

                                                    background:
                                                        'var(--color-card, #f4f8fc)',

                                                    border:
                                                        '1px solid var(--color-detail, #b9d8e1)'
                                                }}
                                            >
                                                Próxima

                                                <i
                                                    className="fa fa-angle-right"
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            {/* ÚLTIMA */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    mudarPagina(
                                                        totalPaginas
                                                    )
                                                }
                                                disabled={
                                                    paginaAtual === totalPaginas
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                style={{
                                                    color:
                                                        'var(--color-blue-deep, #2b5f7a)',

                                                    background:
                                                        'var(--color-card, #f4f8fc)',

                                                    border:
                                                        '1px solid var(--color-detail, #b9d8e1)'
                                                }}
                                            >
                                                Última

                                                <i
                                                    className="fa fa-angle-double-right"
                                                    aria-hidden="true"
                                                />
                                            </button>

                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}