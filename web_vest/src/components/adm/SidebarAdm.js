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
            icon: 'fa-bar-chart'
        },
        {
            name: 'Gerenciamento',
            icon: 'fa-folder-open-o',
            submenu: [
                {
                    name: 'Vestibulares',
                    path: '/adm/dashboard/vestibulares',
                    icon: 'fa-graduation-cap'
                },
                {
                    name: 'Cursos',
                    path: '/adm/dashboard/cursos',
                    icon: 'fa-book'
                },
                {
                    name: 'Provas Anteriores',
                    path: '/adm/dashboard/provas',
                    icon: 'fa-file-text-o'
                }
            ]
        },
        {
            name: 'Automação',
            icon: 'fa-cogs',
            submenu: [
                {
                    name: 'Scraping',
                    path: '/adm/dashboard/scraping',
                    icon: 'fa-refresh'
                }
            ]
        },
        {
            name: 'Sugestões',
            path: '/adm/dashboard/sugestoes',
            icon: 'fa-lightbulb-o'
        }
    ];

    function abrirMenu() {
        setMenuAberto(true);
    }

    function fecharMenu() {
        setMenuAberto(false);

        setTimeout(() => {
            setSubmenuAberto(null);
        }, 300);
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

        setTimeout(() => {
            router.replace('/adm');
        }, 250);
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
                onClick={abrirMenu}
                className={`
                    fixed
                    top-5
                    left-5
                    z-40
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    shadow-sm
                    transition-all
                    duration-300
                    ease-out
                    hover:shadow-md
                    ${menuAberto
                        ? 'opacity-0 pointer-events-none scale-90'
                        : 'opacity-100 scale-100'
                    }
                `}
                style={{
                    background:
                        'var(--color-blue-deep, #2b5f7a)'
                }}
                aria-label="Abrir menu"
            >
                <i
                    className="fa fa-bars"
                    aria-hidden="true"
                    style={{
                        color: '#FFFFFF',
                        fontSize: '20px'
                    }}
                />
            </button>

            <div
                className={`
                    fixed
                    inset-0
                    z-50
                    transition-all
                    duration-300
                    ease-out
                    ${menuAberto
                        ? 'visible'
                        : 'invisible pointer-events-none'
                    }
                `}
            >
                <button
                    type="button"
                    onClick={fecharMenu}
                    className={`
                        absolute
                        inset-0
                        w-full
                        h-full
                        transition-opacity
                        duration-300
                        ease-out
                        ${menuAberto
                            ? 'opacity-100'
                            : 'opacity-0'
                        }
                    `}
                    style={{
                        background:
                            'rgba(25, 43, 52, 0.32)'
                    }}
                    aria-label="Fechar menu"
                />

                <aside
                    className={`
                        absolute
                        left-0
                        top-0
                        h-full
                        w-[300px]
                        max-w-[88vw]
                        text-white
                        flex
                        flex-col
                        shadow-xl
                        overflow-hidden
                        transition-transform
                        duration-500
                        ease-out
                        ${menuAberto
                            ? 'translate-x-0'
                            : '-translate-x-full'
                        }
                    `}
                    style={{
                        background:
                            'var(--color-blue-deep, #2b5f7a)',
                        fontFamily:
                            'Inter, sans-serif'
                    }}
                >
                    <div
                        className="px-6 py-6 flex items-start justify-between"
                        style={{
                            borderBottom:
                                '1px solid rgba(185,216,225,0.18)'
                        }}
                    >
                        <div>
                            <span
                                className="block text-2xl font-bold"
                                style={{
                                    fontFamily:
                                        '"DM Serif Text", serif',
                                    letterSpacing:
                                        '-0.01em'
                                }}
                            >
                                AgendaVest
                            </span>

                            <span
                                className="block text-[10px] tracking-[0.18em] uppercase font-semibold mt-1"
                                style={{
                                    color:
                                        'var(--color-detail, #b9d8e1)',
                                    opacity: 0.8
                                }}
                            >
                                Painel Restrito
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={fecharMenu}
                            className="
                                w-10
                                h-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                transition-all
                                duration-300
                                hover:bg-white/10
                            "
                            aria-label="Fechar menu"
                        >
                            <i
                                className="fa fa-times"
                                aria-hidden="true"
                                style={{
                                    fontSize: '17px'
                                }}
                            />
                        </button>
                    </div>

                    <div className="relative flex-1 overflow-hidden">

                        <div
                            className={`
                                absolute
                                inset-0
                                flex
                                flex-col
                                transition-transform
                                duration-500
                                ease-in-out
                                ${submenuAberto
                                    ? '-translate-x-full'
                                    : 'translate-x-0'
                                }
                            `}
                        >
                            <nav className="flex-1 px-4 py-5 flex flex-col gap-1.5">

                                {menuItems.map(item => {
                                    const possuiSubmenu =
                                        Array.isArray(item.submenu);

                                    const ativo =
                                        possuiSubmenu
                                            ? submenuAtivo(
                                                item.submenu
                                            )
                                            : itemAtivo(
                                                item.path
                                            );

                                    if (possuiSubmenu) {
                                        return (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() =>
                                                    abrirSubmenu(
                                                        item
                                                    )
                                                }
                                                className="
                                                    group
                                                    w-full
                                                    flex
                                                    items-center
                                                    justify-between
                                                    px-4
                                                    py-3.5
                                                    rounded-xl
                                                    text-sm
                                                    transition-all
                                                    duration-300
                                                    ease-out
                                                    hover:bg-white/10
                                                "
                                                style={{
                                                    background:
                                                        ativo
                                                            ? 'rgba(98,155,181,0.45)'
                                                            : 'transparent',

                                                    color:
                                                        ativo
                                                            ? '#FFFFFF'
                                                            : 'rgba(255,255,255,0.82)'
                                                }}
                                            >
                                                <div className="flex items-center gap-4">

                                                    <div
                                                        className="
                                                            w-8
                                                            h-8
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            transition-all
                                                            duration-300
                                                            group-hover:bg-white/10
                                                        "
                                                    >
                                                        <i
                                                            className={`fa ${item.icon}`}
                                                            aria-hidden="true"
                                                            style={{
                                                                fontSize:
                                                                    '15px'
                                                            }}
                                                        />
                                                    </div>

                                                    <span
                                                        className={
                                                            ativo
                                                                ? 'font-semibold'
                                                                : 'font-normal'
                                                        }
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>

                                                <i
                                                    className="
                                                        fa
                                                        fa-angle-right
                                                        transition-transform
                                                        duration-300
                                                        group-hover:translate-x-1
                                                    "
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            onClick={fecharMenu}
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-4
                                                px-4
                                                py-3.5
                                                rounded-xl
                                                text-sm
                                                transition-all
                                                duration-300
                                                ease-out
                                                hover:bg-white/10
                                            "
                                            style={{
                                                background:
                                                    ativo
                                                        ? 'rgba(98,155,181,0.45)'
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
                                            <div
                                                className="
                                                    w-8
                                                    h-8
                                                    rounded-lg
                                                    flex
                                                    items-center
                                                    justify-center
                                                    transition-all
                                                    duration-300
                                                    group-hover:bg-white/10
                                                "
                                            >
                                                <i
                                                    className={`fa ${item.icon}`}
                                                    aria-hidden="true"
                                                    style={{
                                                        fontSize:
                                                            '15px'
                                                    }}
                                                />
                                            </div>

                                            <span>
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div
                            className={`
                                absolute
                                inset-0
                                flex
                                flex-col
                                transition-transform
                                duration-500
                                ease-in-out
                                ${submenuAberto
                                    ? 'translate-x-0'
                                    : 'translate-x-full'
                                }
                            `}
                            style={{
                                background:
                                    'var(--color-blue-deep, #2b5f7a)'
                            }}
                        >
                            {submenuAberto && (
                                <>
                                    <div
                                        className="px-5 py-5"
                                        style={{
                                            borderBottom:
                                                '1px solid rgba(185,216,225,0.15)'
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={voltarMenu}
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                transition-all
                                                duration-300
                                                hover:opacity-80
                                            "
                                            style={{
                                                color:
                                                    'rgba(255,255,255,0.75)'
                                            }}
                                        >
                                            <i
                                                className="
                                                    fa
                                                    fa-angle-left
                                                    transition-transform
                                                    duration-300
                                                    group-hover:-translate-x-1
                                                "
                                                aria-hidden="true"
                                            />

                                            <span>
                                                Voltar
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-3 mt-5">
                                            <div
                                                className="
                                                    w-9
                                                    h-9
                                                    rounded-lg
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                                style={{
                                                    background:
                                                        'rgba(255,255,255,0.08)'
                                                }}
                                            >
                                                <i
                                                    className={`fa ${submenuAberto.icon}`}
                                                    aria-hidden="true"
                                                    style={{
                                                        fontSize:
                                                            '15px'
                                                    }}
                                                />
                                            </div>

                                            <span className="font-semibold text-base">
                                                {submenuAberto.name}
                                            </span>
                                        </div>
                                    </div>

                                    <nav className="flex-1 px-4 py-5 flex flex-col gap-1.5">

                                        {submenuAberto.submenu.map(
                                            item => {
                                                const ativo =
                                                    itemAtivo(
                                                        item.path
                                                    );

                                                return (
                                                    <Link
                                                        key={
                                                            item.path
                                                        }
                                                        href={
                                                            item.path
                                                        }
                                                        onClick={
                                                            fecharMenu
                                                        }
                                                        className="
                                                            group
                                                            flex
                                                            items-center
                                                            gap-4
                                                            px-4
                                                            py-3.5
                                                            rounded-xl
                                                            text-sm
                                                            transition-all
                                                            duration-300
                                                            hover:bg-white/10
                                                        "
                                                        style={{
                                                            background:
                                                                ativo
                                                                    ? 'rgba(98,155,181,0.45)'
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
                                                        <div
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                flex
                                                                items-center
                                                                justify-center
                                                                transition-all
                                                                duration-300
                                                                group-hover:bg-white/10
                                                            "
                                                        >
                                                            <i
                                                                className={`fa ${item.icon}`}
                                                                aria-hidden="true"
                                                                style={{
                                                                    fontSize:
                                                                        '15px'
                                                                }}
                                                            />
                                                        </div>

                                                        <span>
                                                            {item.name}
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
                        className="px-4 py-4"
                        style={{
                            borderTop:
                                '1px solid rgba(185,216,225,0.15)'
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                group
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3.5
                                rounded-xl
                                text-sm
                                text-left
                                font-medium
                                transition-all
                                duration-300
                                hover:bg-red-400/10
                            "
                            style={{
                                color: '#F3B4B4'
                            }}
                        >
                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    duration-300
                                    group-hover:bg-red-400/10
                                "
                            >
                                <i
                                    className="fa fa-sign-out"
                                    aria-hidden="true"
                                    style={{
                                        fontSize:
                                            '15px'
                                    }}
                                />
                            </div>

                            <span>
                                Sair do Sistema
                            </span>
                        </button>
                    </div>
                </aside>
            </div>
        </>
    );
}