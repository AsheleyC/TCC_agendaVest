'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SidebarAdm() {
    const pathname = usePathname();
    const router = useRouter();

    const [menuAberto, setMenuAberto] = useState(false);
    const [submenuAberto, setSubmenuAberto] = useState(null);

    const menuItems = [
        {
            name: 'Visão Geral',
            path: '/adm/dashboard',
            icon: '📊'
        },
        {
            name: 'Gerenciamento',
            icon: '⚙️',
            submenu: [
                {
                    name: 'Vestibulares',
                    path: '/adm/dashboard/vestibulares',
                    icon: '🎓'
                },
                {
                    name: 'Cursos',
                    path: '/adm/dashboard/cursos',
                    icon: '📚'
                },
                {
                    name: 'Provas Anteriores',
                    path: '/adm/dashboard/provas',
                    icon: '📝'
                }
            ]
        },
        {
            name: 'Automação',
            icon: '🔄',
            submenu: [
                {
                    name: 'Scraping',
                    path: '/adm/dashboard/scraping',
                    icon: '🔄'
                }
            ]
        },
        {
            name: 'Sugestões',
            path: '/adm/dashboard/sugestoes',
            icon: '💡'
        }
    ];

    function fecharMenu() {
        setMenuAberto(false);
        setSubmenuAberto(null);
    }

    function abrirSubmenu(item) {
        setSubmenuAberto(item);
    }

    function voltarMenu() {
        setSubmenuAberto(null);
    }

    function handleLogout() {
        localStorage.removeItem('tokenAdm');

        fecharMenu();

        router.replace('/adm');
    }

    function itemAtivo(path) {
        return pathname === path;
    }

    function submenuAtivo(submenu) {
        return submenu?.some(
            item => pathname === item.path
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setMenuAberto(true)}
                className="fixed top-5 left-5 z-40 w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-[5px] shadow-md transition hover:scale-105"
                style={{
                    background: 'var(--color-blue-deep, #2b5f7a)'
                }}
                aria-label="Abrir menu"
            >
                <span
                    className="block w-5 h-[2px] rounded-full"
                    style={{
                        background: '#FFFFFF'
                    }}
                />

                <span
                    className="block w-5 h-[2px] rounded-full"
                    style={{
                        background: '#FFFFFF'
                    }}
                />

                <span
                    className="block w-5 h-[2px] rounded-full"
                    style={{
                        background: '#FFFFFF'
                    }}
                />
            </button>

            {menuAberto && (
                <div
                    className="fixed inset-0 z-50"
                    aria-hidden={!menuAberto}
                >
                    <button
                        type="button"
                        className="absolute inset-0 w-full h-full"
                        style={{
                            background: 'rgba(0, 0, 0, 0.35)'
                        }}
                        onClick={fecharMenu}
                        aria-label="Fechar menu"
                    />

                    <aside
                        className="absolute left-0 top-0 h-full w-[290px] max-w-[88vw] text-white flex flex-col shadow-2xl overflow-hidden"
                        style={{
                            background:
                                'var(--color-blue-deep, #2b5f7a)',
                            fontFamily: 'Inter, sans-serif'
                        }}
                    >
                        <div
                            className="px-6 py-6 flex items-start justify-between"
                            style={{
                                borderBottom:
                                    '1px solid rgba(185,216,225,0.2)'
                            }}
                        >
                            <div>
                                <span
                                    className="block text-2xl font-bold tracking-tight"
                                    style={{
                                        fontFamily:
                                            '"DM Serif Text", serif'
                                    }}
                                >
                                    AgendaVest
                                </span>

                                <span
                                    className="block text-[11px] tracking-widest uppercase font-semibold mt-0.5"
                                    style={{
                                        color:
                                            'var(--color-detail, #b9d8e1)',
                                        opacity: 0.85
                                    }}
                                >
                                    Painel Restrito
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={fecharMenu}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-2xl transition hover:bg-white/10"
                                aria-label="Fechar menu"
                            >
                                ×
                            </button>
                        </div>

                        <div className="relative flex-1 overflow-hidden">
                            <div
                                className={`absolute inset-0 flex flex-col transition-transform duration-300 ${submenuAberto
                                        ? '-translate-x-full'
                                        : 'translate-x-0'
                                    }`}
                            >
                                <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
                                    {menuItems.map((item) => {
                                        const possuiSubmenu =
                                            Array.isArray(item.submenu);

                                        const ativo = possuiSubmenu
                                            ? submenuAtivo(item.submenu)
                                            : itemAtivo(item.path);

                                        if (possuiSubmenu) {
                                            return (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() =>
                                                        abrirSubmenu(item)
                                                    }
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition"
                                                    style={{
                                                        background: ativo
                                                            ? 'var(--color-blue, #629bb5)'
                                                            : 'transparent',
                                                        color: ativo
                                                            ? '#FFFFFF'
                                                            : 'rgba(255,255,255,0.82)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base w-5 text-center">
                                                            {item.icon}
                                                        </span>

                                                        <span
                                                            className={
                                                                ativo
                                                                    ? 'font-semibold'
                                                                    : ''
                                                            }
                                                        >
                                                            {item.name}
                                                        </span>
                                                    </div>

                                                    <span className="text-xl opacity-70">
                                                        ›
                                                    </span>
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={fecharMenu}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150"
                                                style={{
                                                    background: ativo
                                                        ? 'var(--color-blue, #629bb5)'
                                                        : 'transparent',
                                                    color: ativo
                                                        ? '#FFFFFF'
                                                        : 'rgba(255,255,255,0.82)',
                                                    fontWeight: ativo
                                                        ? '600'
                                                        : '400'
                                                }}
                                            >
                                                <span className="text-base w-5 text-center">
                                                    {item.icon}
                                                </span>

                                                <span>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div
                                className={`absolute inset-0 flex flex-col transition-transform duration-300 ${submenuAberto
                                        ? 'translate-x-0'
                                        : 'translate-x-full'
                                    }`}
                                style={{
                                    background:
                                        'var(--color-blue-deep, #2b5f7a)'
                                }}
                            >
                                {submenuAberto && (
                                    <>
                                        <div
                                            className="px-4 py-4"
                                            style={{
                                                borderBottom:
                                                    '1px solid rgba(185,216,225,0.15)'
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={voltarMenu}
                                                className="flex items-center gap-2 text-sm transition hover:opacity-80"
                                                style={{
                                                    color:
                                                        'rgba(255,255,255,0.85)'
                                                }}
                                            >
                                                <span className="text-xl">
                                                    ‹
                                                </span>

                                                <span>
                                                    Voltar
                                                </span>
                                            </button>

                                            <div className="flex items-center gap-3 mt-4 px-2">
                                                <span className="text-lg">
                                                    {submenuAberto.icon}
                                                </span>

                                                <span className="font-semibold text-base">
                                                    {submenuAberto.name}
                                                </span>
                                            </div>
                                        </div>

                                        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                                            {submenuAberto.submenu.map(
                                                item => {
                                                    const ativo =
                                                        itemAtivo(
                                                            item.path
                                                        );

                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            href={item.path}
                                                            onClick={
                                                                fecharMenu
                                                            }
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                                                            style={{
                                                                background:
                                                                    ativo
                                                                        ? 'var(--color-blue, #629bb5)'
                                                                        : 'transparent',
                                                                color:
                                                                    ativo
                                                                        ? '#FFFFFF'
                                                                        : 'rgba(255,255,255,0.82)',
                                                                fontWeight:
                                                                    ativo
                                                                        ? '600'
                                                                        : '400'
                                                            }}
                                                        >
                                                            <span className="text-base w-5 text-center">
                                                                {
                                                                    item.icon
                                                                }
                                                            </span>

                                                            <span>
                                                                {
                                                                    item.name
                                                                }
                                                            </span>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                        </nav>
                                    </>
                                )}
                            </div>
                        </div>

                        <div
                            className="px-3 py-4"
                            style={{
                                borderTop:
                                    '1px solid rgba(185,216,225,0.15)'
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left font-medium transition hover:bg-white/5"
                                style={{
                                    color: '#ffb2b2'
                                }}
                            >
                                <span>
                                    🚪
                                </span>

                                <span>
                                    Sair do Sistema
                                </span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}