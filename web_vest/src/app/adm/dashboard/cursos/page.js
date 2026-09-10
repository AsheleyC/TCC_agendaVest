'use client';

import { useState, useEffect } from 'react';

import SidebarAdm from '../../../../components/adm/SidebarAdm';

import CursoForm from '../../../../components/adm/CursoForm';

import { apiFetch } from '../../../../components/utils/api';

export default function CursosPage() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [universidades, setUniversidades] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 8;

  const fetchItems = async () => {
    setLoading(true);

    try {
      const [
        resCursos,
        resUniversidades
      ] = await Promise.all([
        apiFetch('/verCurso'),
        apiFetch('/verUniversidade')
      ]);

      setData(resCursos || []);
      setUniversidades(resUniversidades || []);
      setPaginaAtual(1);

    } catch (e) {
      alert(
        `Erro ao carregar dados: ${e.message}`
      );

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
          `/atualCurso/${selected.id_curso}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload)
          }
        );
      } else {
        await apiFetch(
          '/addCurso',
          {
            method: 'POST',
            body: JSON.stringify(payload)
          }
        );
      }

      setView('list');

      fetchItems();

    } catch (e) {
      alert(
        `Erro ao salvar curso: ${e.message}`
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        'Deseja realmente excluir este curso?'
      )
    ) {
      return;
    }

    try {
      await apiFetch(
        `/delCurso/${id}`,
        {
          method: 'DELETE'
        }
      );

      await fetchItems();

    } catch (e) {
      alert(
        `Erro ao remover curso: ${e.message}`
      );
    }
  };

  const totalPaginas =
    Math.ceil(
      data.length / itensPorPagina
    );

  const indiceInicial =
    (paginaAtual - 1) *
    itensPorPagina;

  const indiceFinal =
    indiceInicial +
    itensPorPagina;

  const dadosPaginados =
    data.slice(
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
              Gerenciamento de Cursos
            </h1>

            <p
              className="text-sm mt-1 opacity-70"
              style={{
                color:
                  'var(--color-ink-light, #7a98b5)'
              }}
            >
              Configure as notas de corte e vinculação das universidades.
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

              Adicionar Curso
            </button>
          )}
        </div>

        {view !== 'list' ? (
          <div
            className="rounded-2xl border p-6 lg:p-10 shadow-sm max-w-2xl w-full"
            style={{
              background:
                'var(--color-card, #f4f8fc)',
              borderColor:
                'var(--color-detail, #b9d8e1)'
            }}
          >
            <CursoForm
              initialData={selected}
              universidadesList={universidades}
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

            Carregando cursos...
          </div>
        ) : (
          <>
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
                    '56px 1fr 2fr 170px 120px',

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
                  Nome do Curso
                </span>

                <span>
                  Universidade
                </span>

                <span>
                  Nota de Corte
                </span>

                <span className="text-center">
                  Ações
                </span>
              </div>

              {data.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    Nenhum curso cadastrado.
                  </p>
                </div>
              ) : (
                dadosPaginados.map(
                  (item, i) => (
                    <div
                      key={
                        item.id_curso
                      }
                      className="grid items-center px-5 py-4 border-b transition-colors duration-200 hover:bg-[rgba(98,155,181,0.05)]"
                      style={{
                        gridTemplateColumns:
                          '56px 1fr 2fr 170px 120px',

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
                        {
                          item.id_curso
                        }
                      </span>

                      <span
                        className="font-semibold text-sm"
                        style={{
                          color:
                            'var(--color-blue-deep, #2b5f7a)'
                        }}
                      >
                        {
                          item.curso
                        }
                      </span>

                      <span
                        className="text-xs"
                        style={{
                          color:
                            'var(--color-ink-light, #7a98b5)'
                        }}
                      >
                        {
                          item.universidade
                        }
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-full font-mono"
                        style={{
                          background:
                            'rgba(43,95,122,0.1)',
                          color:
                            'var(--color-blue-deep, #2b5f7a)'
                        }}
                      >
                        <i
                          className="fa fa-line-chart"
                          aria-hidden="true"
                        />

                        {parseFloat(
                          item.nota_corte
                        ).toFixed(2)}
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
                              item.id_curso
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

            {data.length > 0 && (
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
                      data.length
                    )}
                  </strong>
                  {' '}de{' '}
                  <strong>
                    {data.length}
                  </strong>
                  {' '}cursos
                </p>

                {totalPaginas > 1 && (
                  <div className="flex items-center gap-3">

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