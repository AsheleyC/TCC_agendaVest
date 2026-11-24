'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarAdm from '../../../../components/adm/SidebarAdm';

function FotoUsuario({ usuario, url_back }) {
    const [erroFoto, setErroFoto] = useState(false);

    const foto = typeof usuario.foto_perfil === 'string'
        ? usuario.foto_perfil.trim()
        : '';

    const caminhoValido = /^\/?uploads\/perfis\/[a-zA-Z0-9._-]+$/.test(foto);

    const caminho = caminhoValido
        ? `/${foto.replace(/^\/+/, '')}`
        : '';

    const fotoUrl = caminho && url_back
        ? `${url_back.replace(/\/$/, '')}${caminho}`
        : '';

    const iniciais = String(usuario.nome_usuario || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(parte => parte.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 font-bold text-lg"
            style={{
                background: 'rgba(98,155,181,0.15)',
                color: '#2b5f7a'
            }}
        >
            {fotoUrl && !erroFoto ? (
                <img
                    src={fotoUrl}
                    alt={`Foto de ${usuario.nome_usuario}`}
                    className="w-full h-full object-cover"
                    onError={() => setErroFoto(true)}
                    loading="lazy"
                />
            ) : (
                <span>{iniciais}</span>
            )}
        </div>
    );
}

export default function UsuariosAdmPage() {
    const router = useRouter();
    const url_back = process.env.NEXT_PUBLIC_API_URL;

    const [autenticado, setAutenticado] = useState(false);
    const [verificando, setVerificando] = useState(true);
    const [carregando, setCarregando] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState('');
    const [atualizacao, setAtualizacao] = useState(0);

    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [confirmacao, setConfirmacao] = useState('');
    const [erroExclusao, setErroExclusao] = useState('');
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function carregarUsuarios() {
            const token = localStorage.getItem('tokenAdm');

            if (!token) {
                setVerificando(false);
                router.replace('/adm');
                return;
            }

            setCarregando(true);
            setErro('');

            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const validacao = await fetch(`${url_back}/validarADM`, {
                    headers,
                    signal: controller.signal
                });

                if (!validacao.ok) {
                    throw new Error('NAO_AUTORIZADO');
                }

                const dadosValidacao = await validacao.json();

                if (dadosValidacao.status === 'false') {
                    throw new Error('NAO_AUTORIZADO');
                }

                setAutenticado(true);
                setVerificando(false);

                const resposta = await fetch(`${url_back}/verUsuariosADM`, {
                    headers,
                    signal: controller.signal
                });

                if (resposta.status === 401 || resposta.status === 403) {
                    throw new Error('NAO_AUTORIZADO');
                }

                if (!resposta.ok) {
                    throw new Error('Não foi possível carregar os usuários.');
                }

                const dados = await resposta.json();

                if (
                    dados.status !== 'true' ||
                    !Array.isArray(dados.usuarios)
                ) {
                    throw new Error('Resposta inválida do servidor.');
                }

                setUsuarios(dados.usuarios);
            } catch (error) {
                if (error.name === 'AbortError') {
                    return;
                }

                if (error.message === 'NAO_AUTORIZADO') {
                    localStorage.removeItem('tokenAdm');
                    setAutenticado(false);
                    router.replace('/adm');
                    return;
                }

                setErro(error.message || 'Erro ao conectar ao servidor.');
            } finally {
                if (!controller.signal.aborted) {
                    setVerificando(false);
                    setCarregando(false);
                }
            }
        }

        carregarUsuarios();

        return () => controller.abort();
    }, [router, url_back, atualizacao]);

    const usuariosFiltrados = useMemo(() => {
        const normalizar = valor => String(valor ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const busca = normalizar(pesquisa.trim());

        if (!busca) {
            return usuarios;
        }

        return usuarios.filter(usuario =>
            normalizar(usuario.nome_usuario).includes(busca) ||
            normalizar(usuario.email).includes(busca) ||
            String(usuario.id_usuario).includes(busca)
        );
    }, [usuarios, pesquisa]);

    function abrirExclusao(usuario) {
        setUsuarioSelecionado(usuario);
        setConfirmacao('');
        setErroExclusao('');
        setAviso('');
    }

    function fecharExclusao() {
        if (excluindo) {
            return;
        }

        setUsuarioSelecionado(null);
        setConfirmacao('');
        setErroExclusao('');
    }

    async function confirmarExclusao() {
        if (
            !usuarioSelecionado ||
            confirmacao.trim().toUpperCase() !== 'EXCLUIR' ||
            excluindo
        ) {
            return;
        }

        setExcluindo(true);
        setErroExclusao('');

        try {
            const token = localStorage.getItem('tokenAdm');

            if (!token) {
                router.replace('/adm');
                return;
            }

            const resposta = await fetch(
                `${url_back}/deletarUsuarioADM/${encodeURIComponent(usuarioSelecionado.id_usuario)}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (resposta.status === 401 || resposta.status === 403) {
                localStorage.removeItem('tokenAdm');
                router.replace('/adm');
                return;
            }

            const resultado = await resposta.json();

            if (!resposta.ok || resultado.status !== 'true') {
                throw new Error(
                    resultado.mensagem ||
                    'Não foi possível excluir o usuário.'
                );
            }

            const idExcluido = usuarioSelecionado.id_usuario;

            setUsuarios(lista =>
                lista.filter(usuario => usuario.id_usuario !== idExcluido)
            );

            setUsuarioSelecionado(null);
            setConfirmacao('');
            setErroExclusao('');
            setAviso('Usuário excluído com sucesso.');
        } catch (error) {
            setErroExclusao(
                error.message || 'Erro ao excluir o usuário.'
            );
        } finally {
            setExcluindo(false);
        }
    }

    if (verificando) {
        return (
            <div
                className="min-h-screen flex items-center justify-center gap-3 text-sm"
                style={{
                    background: 'var(--color-bg, #e5ecf6)',
                    color: '#2b5f7a'
                }}
            >
                <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                Verificando acesso...
            </div>
        );
    }

    if (!autenticado) {
        return null;
    }

    return (
        <div
            className="flex min-h-screen font-sans"
            style={{
                background: 'var(--color-bg, #e5ecf6)',
                color: 'var(--color-ink, #4a698d)'
            }}
        >
            <SidebarAdm />

            <main className="flex-1 min-w-0 px-4 pb-10 pt-24 sm:px-6 lg:px-10">
                <div className="mb-8">
                    <span
                        className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
                        style={{ color: '#629bb5' }}
                    >
                        Painel Restrito
                    </span>

                    <h1
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                        style={{
                            color: '#2b5f7a',
                            fontFamily: '"DM Serif Text", serif'
                        }}
                    >
                        Usuários Cadastrados
                    </h1>

                    <p className="text-sm mt-2" style={{ color: '#7a98b5' }}>
                        Consulte e gerencie as contas do AgendaVest.
                    </p>
                </div>

                {aviso && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border px-4 py-3 text-sm flex items-center gap-3"
                        style={{
                            background: '#edf7f1',
                            borderColor: '#bfdfcc',
                            color: '#286446'
                        }}
                    >
                        <i className="fa fa-check-circle" aria-hidden="true" />
                        {aviso}
                    </div>
                )}

                <section
                    className="rounded-2xl border p-4 sm:p-6 shadow-sm"
                    style={{
                        background: 'var(--color-card, #f4f8fc)',
                        borderColor: '#b9d8e1'
                    }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: '#2b5f7a' }}>
                                Lista de usuários
                            </h2>
                            <p className="text-xs mt-1" style={{ color: '#7a98b5' }}>
                                {usuariosFiltrados.length} de {usuarios.length} usuário(s)
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setAviso('');
                                setAtualizacao(valor => valor + 1);
                            }}
                            disabled={carregando}
                            className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-75 disabled:opacity-50"
                            style={{
                                color: '#2b5f7a',
                                borderColor: '#b9d8e1'
                            }}
                        >
                            <i
                                className={`fa ${carregando ? 'fa-spinner fa-spin' : 'fa-refresh'} mr-2`}
                                aria-hidden="true"
                            />
                            Atualizar
                        </button>
                    </div>

                    <label
                        htmlFor="pesquisa-usuarios"
                        className="block text-xs font-semibold mb-2"
                    >
                        Pesquisar usuários
                    </label>

                    <div className="relative mb-6">
                        <i
                            className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2"
                            style={{ color: '#7a98b5' }}
                            aria-hidden="true"
                        />

                        <input
                            id="pesquisa-usuarios"
                            type="search"
                            value={pesquisa}
                            onChange={evento => setPesquisa(evento.target.value)}
                            placeholder="Nome, e-mail ou ID..."
                            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#629bb5]"
                            style={{
                                background: '#FFFFFF',
                                borderColor: '#b9d8e1',
                                color: '#2b5f7a'
                            }}
                        />
                    </div>

                    {erro ? (
                        <div
                            role="alert"
                            className="rounded-xl bg-red-50 text-red-700 text-sm p-4"
                        >
                            {erro}
                        </div>
                    ) : carregando ? (
                        <p className="py-10 text-center text-sm">
                            <i className="fa fa-spinner fa-spin mr-2" aria-hidden="true" />
                            Carregando usuários...
                        </p>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="py-12 text-center text-sm" style={{ color: '#7a98b5' }}>
                            <i className="fa fa-users block text-3xl mb-3" aria-hidden="true" />
                            {pesquisa
                                ? 'Nenhum usuário encontrado.'
                                : 'Nenhum usuário cadastrado.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {usuariosFiltrados.map(usuario => (
                                <article
                                    key={usuario.id_usuario}
                                    className="rounded-2xl border p-4 sm:p-5 flex flex-col gap-5"
                                    style={{
                                        background: '#FFFFFF',
                                        borderColor: '#d5e4ed'
                                    }}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <FotoUsuario
                                            usuario={usuario}
                                            url_back={url_back}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className="font-bold text-base truncate"
                                                style={{ color: '#2b5f7a' }}
                                            >
                                                {usuario.nome_usuario}
                                            </h3>

                                            <p
                                                className="text-xs sm:text-sm break-all mt-1"
                                                style={{ color: '#7a98b5' }}
                                            >
                                                {usuario.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-2 gap-3 rounded-xl p-4"
                                        style={{ background: '#f0f5f9' }}
                                    >
                                        <div>
                                            <span
                                                className="block uppercase text-[10px] font-bold tracking-wider mb-1"
                                                style={{ color: '#7a98b5' }}
                                            >
                                                ID do usuário
                                            </span>
                                            <span
                                                className="font-bold text-lg"
                                                style={{ color: '#2b5f7a' }}
                                            >
                                                #{usuario.id_usuario}
                                            </span>
                                        </div>

                                        <div>
                                            <span
                                                className="block uppercase text-[10px] font-bold tracking-wider mb-1"
                                                style={{ color: '#7a98b5' }}
                                            >
                                                Na agenda
                                            </span>
                                            <span
                                                className="font-bold text-lg"
                                                style={{ color: '#2b5f7a' }}
                                            >
                                                {usuario.vestibulares_acompanhados ?? 0}
                                            </span>
                                            <span
                                                className="text-[10px] block"
                                                style={{ color: '#7a98b5' }}
                                            >
                                                Vestibulares acompanhados
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => abrirExclusao(usuario)}
                                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all hover:bg-red-50"
                                            style={{
                                                color: '#b43e45',
                                                borderColor: '#f0c6c9'
                                            }}
                                            aria-label={`Excluir usuário ${usuario.nome_usuario}`}
                                        >
                                            <i className="fa fa-trash-o" aria-hidden="true" />
                                            Excluir usuário
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {usuarioSelecionado && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: 'rgba(25,43,52,0.55)' }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-exclusao"
                >
                    <div
                        className="w-full max-w-md rounded-2xl shadow-xl p-6"
                        style={{ background: '#FFFFFF' }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{
                                background: '#fff0f0',
                                color: '#b43e45'
                            }}
                        >
                            <i className="fa fa-trash-o text-xl" aria-hidden="true" />
                        </div>

                        <h2
                            id="titulo-exclusao"
                            className="text-xl font-bold mb-3"
                            style={{
                                color: '#2b5f7a',
                                fontFamily: '"DM Serif Text", serif'
                            }}
                        >
                            Excluir usuário?
                        </h2>

                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#647b8e' }}>
                            Você está prestes a excluir permanentemente a conta de
                            {' '}
                            <strong>{usuarioSelecionado.nome_usuario}</strong>.
                        </p>

                        <div
                            className="rounded-xl p-4 mb-4 text-xs leading-relaxed"
                            style={{
                                background: '#fff4f4',
                                color: '#9d444a'
                            }}
                        >
                            Esta ação não poderá ser desfeita. A conta e os
                            vestibulares de sua agenda serão removidos.
                        </div>

                        <label
                            htmlFor="confirmar-exclusao"
                            className="block text-sm font-medium mb-2"
                            style={{ color: '#2b5f7a' }}
                        >
                            Digite <strong>EXCLUIR</strong> para confirmar:
                        </label>

                        <input
                            id="confirmar-exclusao"
                            type="text"
                            value={confirmacao}
                            onChange={evento => setConfirmacao(evento.target.value)}
                            disabled={excluindo}
                            autoComplete="off"
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#629bb5]"
                            style={{
                                borderColor: '#b9d8e1',
                                color: '#2b5f7a'
                            }}
                        />

                        {erroExclusao && (
                            <p
                                role="alert"
                                className="text-sm mt-3"
                                style={{ color: '#b43e45' }}
                            >
                                {erroExclusao}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={fecharExclusao}
                                disabled={excluindo}
                                className="rounded-xl px-4 py-3 text-sm font-semibold border disabled:opacity-50"
                                style={{
                                    borderColor: '#b9d8e1',
                                    color: '#2b5f7a'
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarExclusao}
                                disabled={
                                    excluindo ||
                                    confirmacao.trim().toUpperCase() !== 'EXCLUIR'
                                }
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                                style={{ background: '#b43e45' }}
                            >
                                {excluindo ? (
                                    <>
                                        <i
                                            className="fa fa-spinner fa-spin mr-2"
                                            aria-hidden="true"
                                        />
                                        Excluindo...
                                    </>
                                ) : (
                                    'Excluir definitivamente'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}