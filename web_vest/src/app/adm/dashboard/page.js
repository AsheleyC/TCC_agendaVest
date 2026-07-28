'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../components/adm/SidebarAdm';
import { apiFetch } from '../../../components/utils/api';

export default function AdmHome() {
  const [metrics, setMetrics] = useState({ v: 0, c: 0, p: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCounters = async () => {
      try {
        const [vest, curs, prov] = await Promise.all([
          apiFetch('/verVest').catch(() => []),
          apiFetch('/verCurso').catch(() => []),
          apiFetch('/verProvas').catch(() => [])
        ]);
        setMetrics({ v: vest?.length || 0, c: curs?.length || 0, p: prov?.length || 0 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getCounters();
  }, []);

  const cards = [
    {
      label: 'Vestibulares Ativos',
      value: metrics.v,
      icon: '🎓',
      accent: 'from-[#629bb5]/10 to-[#3d7a9a]/5',
      iconBg: 'bg-[#629bb5]/15',
      border: 'border-[#629bb5]/20',
    },
    {
      label: 'Cursos Mapeados',
      value: metrics.c,
      icon: '📚',
      accent: 'from-[#3d7a9a]/10 to-[#2b5f7a]/5',
      iconBg: 'bg-[#3d7a9a]/15',
      border: 'border-[#3d7a9a]/20',
    },
    {
      label: 'Acervo Provas',
      value: metrics.p,
      icon: '📝',
      accent: 'from-[#2b5f7a]/10 to-[#629bb5]/5',
      iconBg: 'bg-[#2b5f7a]/15',
      border: 'border-[#2b5f7a]/20',
    },
  ];

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ background: 'var(--color-bg, #e5ecf6)', color: 'var(--color-ink, #4a698d)' }}
    >
      <SidebarAdm />

      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="text-3xl lg:text-4xl font-serif font-bold leading-tight"
            style={{ color: 'var(--color-blue-deep, #2b5f7a)', fontFamily: '"DM Serif Text", serif' }}
          >
            Painel Executivo
          </h1>
          <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
            Controle integrado dos indicadores e dados da aplicação pública.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-sm opacity-60" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sincronizando bancos de dados...
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-2xl border p-6 flex items-center justify-between bg-gradient-to-br ${card.accent} ${card.border} shadow-sm backdrop-blur-sm`}
                  style={{ background: 'var(--color-card, #f4f8fc)' }}
                >
                  <div>
                    <span
                      className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1 opacity-60"
                      style={{ color: 'var(--color-ink-light, #7a98b5)' }}
                    >
                      {card.label}
                    </span>
                    <span
                      className="text-4xl font-extrabold leading-none"
                      style={{ color: 'var(--color-blue-deep, #2b5f7a)', fontFamily: '"DM Serif Text", serif' }}
                    >
                      {card.value}
                    </span>
                  </div>
                  <span className={`text-2xl p-3 rounded-xl ${card.iconBg}`}>{card.icon}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
