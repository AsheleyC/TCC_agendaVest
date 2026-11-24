'use client';

import { useState, useEffect } from 'react';

import SidebarAdm from '../../../../components/adm/SidebarAdm';

import VestibularForm from '../../../../components/adm/VestibularForm';

import { apiFetch } from '../../../../components/utils/api';

export default function VestibularesPage() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pesquisa, setPesquisa] = useState('');

  const itensPorPagina = 8;

  const fetchItems = async () => {
    setLoading(true);

    try {
      const res = await apiFetch('/verVest');

      setData(res || []);
      setPaginaAtual(1);

    } catch (e) {
      alert(e.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (view === 'edit') {
        await apiFetch(
          `/atualVest/${selected.id_vestibular}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload)
          }
        );
      } else {
        await apiFetch(
          '/cadVest',
          {
            method: 'POST',
            body: JSON.stringify(payload)
          }
        );
      }

      setView('list');

      fetchItems();

    } catch (e) {
      if (e.status === 400) {
        alert(e.message);
      } else {
        alert(
          'Ocorreu um erro interno. Tente novamente mais tarde.'
        );
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        'Deseja de fato remover permanentemente este registro?'
      )
    ) {
      return;
    }

    try {
      await apiFetch(
        `/delVest/${id}`,
        {
          method: 'DELETE'
        }
      );

      await fetchItems();

    } catch (e) {
      alert(e.message);
    }
  };

  const dadosFiltrados = data.filter((item) => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) {
      return true;
    }

    return (
      item.vestibular
        ?.toLowerCase()
        .includes(termo) ||
      String(item.id_vestibular || '')
        .includes(termo) ||
      String(item.taxa_prova || '')
        .includes(termo) ||
      item.data_inicio_inscricao
        ?.toLowerCase()
        .includes(termo) ||
      item.data_fim_inscricao
        ?.toLowerCase()
        .includes(termo) ||
      item.data_prova
        ?.toLowerCase()
        .includes(termo)
    );
  });

  const totalPaginas =
    Math.ceil(
      dadosFiltrados.length /
      itensPorPagina
    );

  const indiceInicial =
    (paginaAtual - 1) *
    itensPorPagina;

  const indiceFinal =
    indiceInicial +
    itensPorPagina;

  const dadosPaginados =
    dadosFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  function mudarPagina(pagina) {
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

      <main className="flex-1 min-w-0 px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pb-10 lg:pt-24 overflow-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">

          <div>
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
              className="text-3xl font-serif font-bold leading-tight"
              style={{
                color:
                  'var(--color-blue-deep, #2b5f7a)',
                fontFamily:
                  '"DM Serif Text", serif'
              }}
            >
              Vestibulares Disponibilizados
            </h1>

            <p
              className="text-sm mt-1 opacity-70"
              style={{
                color:
                  'var(--color-ink-light, #7a98b5)'
              }}
            >
              Insira, edite e acompanhe os dados e links de editais.
            </p>
          </div>

          {view === 'list' && (
            <button
              onClick={() => {
                setSelected(null);
                setView('create');
              }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background:
                  'var(--color-blue-dark, #3d7a9a)'
              }}
            >
              <i
                className="fa fa-plus"
                aria-hidden="true"
              />

              Cadastrar Vestibular
            </button>
          )}
        </div>

        {view !== 'list' ? (
          <div
            className="rounded-2xl border pt-5 pb-6 px-6 lg:pt-6 lg:pb-8 lg:px-10 shadow-sm max-w-2xl w-full"
            style={{
              background:
                'var(--color-card, #f4f8fc)',
              borderColor:
                'var(--color-detail, #b9d8e1)'
            }}
          >
            <VestibularForm
              initialData={selected}
              onSubmit={handleSave}
              onCancel={() =>
                setView('list')
              }
            />
          </div>
        ) : loading ? (
          <div
            className="flex items-center gap-3 text-sm opacity-60"
            style={{
              color:
                'var(--color-ink-light, #7a98b5)'
            }}
          >
            <i
              className="fa fa-spinner fa-spin"
              aria-hidden="true"
            />

            Buscando dados no servidor MVC...
          </div>
        ) : (
          <>

            <div className="mb-5">
              <div className="relative w-full max-w-md">

                <i
                  className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  aria-hidden="true"
                  style={{
                    color:
                      'var(--color-ink-light, #7a98b5)'
                  }}
                />

                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => {
                    setPesquisa(e.target.value);
                    setPaginaAtual(1);
                  }}
                  placeholder="Pesquisar vestibular..."
                  className="w-full rounded-xl border py-3 pl-11 pr-10 text-sm outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    background:
                      'var(--color-card, #f4f8fc)',
                    borderColor:
                      'var(--color-detail, #b9d8e1)',
                    color:
                      'var(--color-ink, #4a698d)'
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

            <div
              className="rounded-2xl border overflow-hidden shadow-sm"
              style={{
                background:
                  'var(--color-card, #f4f8fc)',
                borderColor:
                  'var(--color-detail, #b9d8e1)'
              }}
            >
              <div
                className="grid text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3.5 border-b"
                style={{
                  gridTemplateColumns:
                    '56px 1fr 1fr 1fr 120px',

                  borderColor:
                    'var(--color-detail, #b9d8e1)',

                  color:
                    'var(--color-ink-light, #7a98b5)',

                  background:
                    'rgba(98,155,181,0.06)'
                }}
              >
                <span>
                  ID
                </span>

                <span>
                  Nome do Vestibular
                </span>

                <span>
                  Período Inscrição
                </span>

                <span>
                  Data Prova
                </span>

                <span className="text-center">
                  Ações
                </span>
              </div>

              {dadosFiltrados.length === 0 ? (
                <div className="py-16 text-center">

                  {pesquisa && (
                    <i
                      className="fa fa-search text-2xl mb-3 opacity-30"
                      aria-hidden="true"
                    />
                  )}

                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {pesquisa
                      ? 'Nenhum vestibular encontrado.'
                      : 'Nenhum vestibular cadastrado.'}
                  </p>

                  {pesquisa && (
                    <p
                      className="text-xs mt-1"
                      style={{
                        color:
                          'var(--color-ink-light, #7a98b5)'
                      }}
                    >
                      Tente pesquisar utilizando outro nome.
                    </p>
                  )}
                </div>
              ) : (
                dadosPaginados.map(
                  (item, i) => (
                    <div
                      key={
                        item.id_vestibular
                      }
                      className="grid items-center px-5 py-4 border-b transition-colors duration-200 hover:bg-[rgba(98,155,181,0.05)]"
                      style={{
                        gridTemplateColumns:
                          '56px 1fr 1fr 1fr 120px',

                        borderColor:
                          i ===
                            dadosPaginados.length - 1
                            ? 'transparent'
                            : 'var(--color-detail, #b9d8e1)'
                      }}
                    >
                      <span
                        className="font-mono text-xs font-bold opacity-40"
                        style={{
                          color:
                            'var(--color-ink, #4a698d)'
                        }}
                      >
                        {item.id_vestibular}
                      </span>

                      <span
                        className="font-semibold text-sm"
                        style={{
                          color:
                            'var(--color-blue-deep, #2b5f7a)'
                        }}
                      >
                        {item.vestibular}
                      </span>

                      <span
                        className="text-xs"
                        style={{
                          color:
                            'var(--color-ink-light, #7a98b5)'
                        }}
                      >
                        {new Date(
                          item.data_inicio_inscricao
                        ).toLocaleDateString(
                          'pt-BR'
                        )}

                        {' – '}

                        {new Date(
                          item.data_fim_inscricao
                        ).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full"
                        style={{
                          background:
                            'rgba(61,122,154,0.1)',
                          color:
                            'var(--color-blue-dark, #3d7a9a)'
                        }}
                      >
                        <i
                          className="fa fa-calendar"
                          aria-hidden="true"
                        />

                        {new Date(
                          item.data_prova
                        ).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() => {
                            setSelected(
                              item
                            );

                            setView(
                              'edit'
                            );
                          }}
                          className="text-xs font-semibold transition-colors hover:underline text-[var(--ink)]"
                        >
                          <i
                            className="fa fa-pencil"
                            aria-hidden="true"
                          />

                          <span className="ml-1">
                            Editar
                          </span>
                        </button>

                        <span className="opacity-20 text-xs">
                          |
                        </span>

                        <button
                          onClick={() =>
                            handleDelete(
                              item.id_vestibular
                            )
                          }
                          className="text-xs font-semibold text-[var(--vermelho)] transition-colors hover:underline"
                        >
                          <i
                            className="fa fa-trash-o"
                            aria-hidden="true"
                          />

                          <span className="ml-1">
                            Remover
                          </span>
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {dadosFiltrados.length > 0 && (
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
                  {' '}vestibulares
                </p>

                {totalPaginas > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2">

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

                    <button
                      type="button"
                      onClick={() =>
                        mudarPagina(
                          paginaAtual + 1
                        )
                      }
                      disabled={
                        paginaAtual ===
                        totalPaginas
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

                    <button
                      type="button"
                      onClick={() =>
                        mudarPagina(
                          totalPaginas
                        )
                      }
                      disabled={
                        paginaAtual ===
                        totalPaginas
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
            )}
          </>
        )}
      </main>
    </div>
  );
}