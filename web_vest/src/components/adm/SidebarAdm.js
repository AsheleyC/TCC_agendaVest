'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function SidebarAdm() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Visão Geral', path: '/adm/dashboard', icon: '📊' },
        { name: 'Vestibulares', path: '/adm/dashboard/vestibulares', icon: '🎓' },
        { name: 'Cursos', path: '/adm/dashboard/cursos', icon: '📚' },
        { name: 'Provas Anteriores', path: '/adm/dashboard/provas', icon: '📝' },
        { name: 'Scraping', path: '/adm/dashboard/scraping', icon: '🔄' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/adm');
    };

    return (
        <aside
            className="w-65 text-white min-h-screen flex flex-col shrink-0"
            style={{ background: 'var(--color-blue-deep, #2b5f7a)', fontFamily: 'Inter, sans-serif' }}
        >
            <div
                className="px-6 py-7 flex flex-col gap-0.5"
                style={{ borderBottom: '1px solid rgba(185,216,225,0.2)' }}
            >
                <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: '"DM Serif Text", serif', letterSpacing: '-0.01em' }}
                >
                    AgendaVest
                </span>
                <span
                    className="text-[11px] tracking-widest uppercase font-semibold"
                    style={{ color: 'var(--color-detail, #b9d8e1)', opacity: 0.85 }}
                >
                    Painel Restrito
                </span>
            </div>

            <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                                isActive
                                    ? 'font-semibold shadow-md'
                                    : 'hover:opacity-90'
                            }`}
                            style={
                                isActive
                                    ? { background: 'var(--color-blue, #629bb5)', color: '#fff' }
                                    : { color: 'rgba(255,255,255,0.78)' }
                            }
                        >
                            <span className="text-base w-5 text-center">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div
                className="px-3 pb-5"
                style={{ borderTop: '1px solid rgba(185,216,225,0.15)' }}
            >
                <div style={{ height: '1px', marginBottom: '12px' }} />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left font-medium"
                    style={{ color: 'var(--vermelho)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ff4d4d';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--vermelho)';
                    }}
                >
                    <span>🚪</span>
                    <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
}