'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../components/adm/SidebarAdm';
import { apiFetch } from '../../../components/utils/api';

export default function AdmHome() {
  const [metrics, setMetrics] = useState({
    v: 0,
    c: 0,
    p: 0,
    s: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCounters = async () => {
      try {
        const [
          vest,
          curs,
          prov,
          sugestoes
        ] = await Promise.all([
          apiFetch('/verVest').catch(() => []),
          apiFetch('/verCurso').catch(() => []),
          apiFetch('/verProvas').catch(() => []),
          apiFetch('/verSugestoes').catch(() => ({
            sugestoes: []
          }))
        ]);

        setMetrics({
          v: vest?.length || 0,
          c: curs?.length || 0,
          p: prov?.length || 0,
          s: sugestoes?.sugestoes?.length || 0
        });
      } catch (e) {
        console.error(
          'Erro ao carregar indicadores:',
          e
        );
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
      description: 'Vestibulares cadastrados',
      iconBg: 'rgba(98,155,181,0.15)'
    },
    {
      label: 'Cursos Mapeados',
      value: metrics.c,
      icon: '📚',
      description: 'Cursos disponíveis',
      iconBg: 'rgba(61,122,154,0.15)'
    },
    {
      label: 'Acervo Provas',
      value: metrics.p,
      icon: '📝',
      description: 'Provas anteriores',
      iconBg: 'rgba(43,95,122,0.15)'
    },
    {
      label: 'Scraping',
      value: 'Ativo',
      icon: '🔄',
      description: 'Coleta automatizada',
      iconBg: 'rgba(98,155,181,0.15)'
    },
    {
      label: 'Sugestões Recebidas',
      value: metrics.s,
      icon: '💡',
      description: 'Sugestões dos usuários',
      iconBg: 'rgba(61,122,154,0.15)'
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

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-auto">
        {/* CABEÇALHO */}
        <div className="mb-8 lg:mb-10">
          <span
            className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
            style={{
              color: 'var(--color-blue, #629bb5)'
            }}
          >
            Painel Restrito
          </span>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight"
            style={{
              color: 'var(--color-blue-deep, #2b5f7a)',
              fontFamily: '"DM Serif Text", serif'
            }}
          >
            Painel Executivo
          </h1>

          <p
            className="text-sm mt-1 opacity-70 max-w-2xl"
            style={{
              color: 'var(--color-ink-light, #7a98b5)'
            }}
          >
            Controle integrado dos indicadores e dados da aplicação pública.
          </p>
        </div>

        {loading ? (
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

            Sincronizando bancos de dados...
          </div>
        ) : (
          <>
            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border p-5 sm:p-6 flex items-center justify-between gap-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: 'var(--color-card, #f4f8fc)',
                    borderColor: 'var(--color-detail, #b9d8e1)'
                  }}
                >
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1 opacity-60"
                      style={{
                        color: 'var(--color-ink-light, #7a98b5)'
                      }}
                    >
                      {card.label}
                    </span>

                    <span
                      className={`font-extrabold leading-none ${typeof card.value === 'number'
                          ? 'text-3xl sm:text-4xl'
                          : 'text-2xl sm:text-3xl'
                        }`}
                      style={{
                        color: 'var(--color-blue-deep, #2b5f7a)',
                        fontFamily: '"DM Serif Text", serif'
                      }}
                    >
                      {card.value}
                    </span>

                    <p
                      className="text-xs mt-2"
                      style={{
                        color: 'var(--color-ink-light, #7a98b5)'
                      }}
                    >
                      {card.description}
                    </p>
                  </div>

                  <span
                    className="text-xl sm:text-2xl p-3 rounded-xl shrink-0"
                    style={{
                      background: card.iconBg
                    }}
                  >
                    {card.icon}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}