'use client';

import {
  useState,
  useEffect
} from 'react';

import {
  useRouter
} from 'next/navigation';

import SidebarAdm from '../../../components/adm/SidebarAdm';

import {
  apiFetch
} from '../../../components/utils/api';

export default function AdmHome() {
  const router = useRouter();

  const url_back =
    process.env.NEXT_PUBLIC_API_URL;

  const [autenticado, setAutenticado] =
    useState(false);

  const [verificando, setVerificando] =
    useState(true);

  const [metrics, setMetrics] = useState({
    v: 0,
    c: 0,
    p: 0,
    s: 0
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function verificarAdm() {
      const token =
        localStorage.getItem(
          'tokenAdm'
        );

      if (!token) {
        router.replace('/adm');
        return;
      }

      try {
        const resposta = await fetch(
          `${url_back}/validarADM`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        if (!resposta.ok) {
          localStorage.removeItem(
            'tokenAdm'
          );

          router.replace('/adm');

          return;
        }

        setAutenticado(true);

      } catch (error) {
        localStorage.removeItem(
          'tokenAdm'
        );

        router.replace('/adm');

      } finally {
        setVerificando(false);
      }
    }

    verificarAdm();

  }, [router, url_back]);

  useEffect(() => {
    if (!autenticado) {
      return;
    }

    const getCounters = async () => {
      try {
        const [
          vest,
          curs,
          prov,
          sugestoes
        ] = await Promise.all([
          apiFetch('/verVest')
            .catch(() => []),

          apiFetch('/verCurso')
            .catch(() => []),

          apiFetch('/verProvas')
            .catch(() => []),

          apiFetch('/verSugestoes')
            .catch(() => ({
              sugestoes: []
            }))
        ]);

        setMetrics({
          v: vest?.length || 0,
          c: curs?.length || 0,
          p: prov?.length || 0,
          s:
            sugestoes
              ?.sugestoes
              ?.length || 0
        });

      } finally {
        setLoading(false);
      }
    };

    getCounters();

  }, [autenticado]);

  const cards = [
    {
      label: 'Vestibulares Ativos',
      value: metrics.v,
      icon: 'fa-graduation-cap',
      description: 'Vestibulares cadastrados'
    },
    {
      label: 'Cursos Mapeados',
      value: metrics.c,
      icon: 'fa-book',
      description: 'Cursos disponíveis'
    },
    {
      label: 'Acervo Provas',
      value: metrics.p,
      icon: 'fa-file-text-o',
      description: 'Provas anteriores'
    },
    {
      label: 'Scraping',
      value: 'Ativo',
      icon: 'fa-refresh',
      description: 'Coleta automatizada'
    },
    {
      label: 'Sugestões Recebidas',
      value: metrics.s,
      icon: 'fa-lightbulb-o',
      description: 'Sugestões dos usuários'
    }
  ];

  if (verificando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'var(--color-bg, #e5ecf6)'
        }}
      >
        <div
          className="flex items-center gap-3 text-sm"
          style={{
            color:
              'var(--color-blue-deep, #2b5f7a)'
          }}
        >
          <i
            className="fa fa-spinner fa-spin"
            style={{
              fontSize: '18px'
            }}
          />

          Verificando acesso...
        </div>
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
        background:
          'var(--color-bg, #e5ecf6)',
        color:
          'var(--color-ink, #4a698d)'
      }}
    >
      <SidebarAdm />

      <main className="flex-1 min-w-0 px-4 pb-6 pt-24 sm:px-6 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-24 overflow-auto">

        <div className="mb-8 lg:mb-10">
          <span
            className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
            style={{
              color:
                'var(--color-blue, #629bb5)'
            }}
          >
            Painel Restrito
          </span>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight"
            style={{
              color:
                'var(--color-blue-deep, #2b5f7a)',
              fontFamily:
                '"DM Serif Text", serif'
            }}
          >
            Painel Executivo
          </h1>

          <p
            className="text-sm mt-1 opacity-70 max-w-2xl"
            style={{
              color:
                'var(--color-ink-light, #7a98b5)'
            }}
          >
            Controle integrado dos indicadores e dados da aplicação pública.
          </p>
        </div>

        {loading ? (
          <div
            className="flex items-center gap-3 text-sm opacity-60"
            style={{
              color:
                'var(--color-ink-light, #7a98b5)'
            }}
          >
            <i
              className="fa fa-spinner fa-spin"
              style={{
                fontSize: '16px'
              }}
            />

            Sincronizando bancos de dados...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border p-5 sm:p-6 flex items-center justify-between gap-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background:
                    'var(--color-card, #f4f8fc)',
                  borderColor:
                    'var(--color-detail, #b9d8e1)'
                }}
              >
                <div className="min-w-0">
                  <span
                    className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1 opacity-60"
                    style={{
                      color:
                        'var(--color-ink-light, #7a98b5)'
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
                      color:
                        'var(--color-blue-deep, #2b5f7a)',
                      fontFamily:
                        '"DM Serif Text", serif'
                    }}
                  >
                    {card.value}
                  </span>

                  <p
                    className="text-xs mt-2"
                    style={{
                      color:
                        'var(--color-ink-light, #7a98b5)'
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      'rgba(98,155,181,0.13)'
                  }}
                >
                  <i
                    className={`fa ${card.icon}`}
                    aria-hidden="true"
                    style={{
                      fontSize: '22px',
                      color:
                        'var(--color-blue-deep, #2b5f7a)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}