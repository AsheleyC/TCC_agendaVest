'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../../components/adm/SidebarAdm';
import CursoForm from '../../../../components/adm/CursoForm';
import { apiFetch } from '../../../../components/utils/api';

export default function CursosPage() {
  const [data, setData] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [universidades, setUniversidades] = useState([]);

  // 1. Busca de itens
  const fetchItems = async () => {
    setLoading(true);
    try {
      const [resCursos, resUniversidades] = await Promise.all([
        apiFetch('/verCurso'),
        apiFetch('/verUniversidade')
      ]);
      setData(resCursos || []);
      setUniversidades(resUniversidades || []);
    } catch (e) {
      alert(`Erro ao carregar dados: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // 2. Salvar / Editar
  const handleSave = async (payload) => {
    try {
      if (view === 'edit') {
        await apiFetch(`/atualCurso/${selected.id_curso}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/addCurso', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setView('list');
      fetchItems();
    } catch (e) {
      alert(`Erro ao salvar curso: ${e.message}`);
    }
  };

  // 3. Exclusão
  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este curso?')) return;
    try {
      await apiFetch(`/delCurso/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (e) {
      alert(`Erro ao remover curso: ${e.message}`);
    }
  };

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ background: 'var(--color-bg, #e5ecf6)', color: 'var(--color-ink, #4a698d)' }}
    >
      <SidebarAdm />

      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span
              className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5 opacity-60"
              style={{ color: 'var(--color-blue, #629bb5)' }}
            >
              Painel Restrito
            </span>
            <h1
              className="text-3xl font-serif font-bold leading-tight"
              style={{ color: 'var(--color-blue-deep, #2b5f7a)', fontFamily: '"DM Serif Text", serif' }}
            >
              Gerenciamento de Cursos
            </h1>
            <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
              Configure as notas de corte e vinculação das universidades.
            </p>
          </div>

          {view === 'list' && (
            <button
              onClick={() => { setSelected(null); setView('create'); }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'var(--color-blue-dark, #3d7a9a)' }}
            >
              <span className="text-base leading-none">+</span>
              Adicionar Curso
            </button>
          )}
        </div>

        {view !== 'list' ? (
          <div
            className="rounded-2xl border p-6 lg:p-10 shadow-sm max-w-2xl w-full"
            style={{ background: 'var(--color-card, #f4f8fc)', borderColor: 'var(--color-detail, #b9d8e1)' }}
          >
            <CursoForm
              initialData={selected}
              universidadesList={universidades}
              onSubmit={handleSave}
              onCancel={() => setView('list')}
            />
          </div>

        ) : loading ? (
          <div className="flex items-center gap-3 text-sm opacity-60" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Carregando cursos...
          </div>
        ) : (
          <div
            className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ background: 'var(--color-card, #f4f8fc)', borderColor: 'var(--color-detail, #b9d8e1)' }}
          >
            {/* Table header */}
            <div
              className="grid text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3.5 border-b"
              style={{
                gridTemplateColumns: '56px 1fr 2fr 170px 120px',
                borderColor: 'var(--color-detail, #b9d8e1)',
                color: 'var(--color-ink-light, #7a98b5)',
                background: 'rgba(98,155,181,0.06)',
              }}
            >
              <span>ID</span>
              <span>Nome do Curso</span>
              <span>Universidade</span>
              <span>Nota de Corte</span>
              <span className="text-center">Ações</span>
            </div>

            {/* Table body */}
            {data.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  Nenhum curso cadastrado.
                </p>
              </div>
            ) : (
              data.map((item, i) => (
                <div
                  key={item.id_curso}
                  className="grid items-center px-5 py-4 border-b transition-colors duration-150 hover:bg-[rgba(98,155,181,0.05)]"
                  style={{
                    gridTemplateColumns: '56px 1fr 2fr 150px 120px',
                    borderColor: i === data.length - 1 ? 'transparent' : 'var(--color-detail, #b9d8e1)',
                  }}
                >
                  <span
                    className="font-mono text-xs font-bold opacity-40"
                    style={{ color: 'var(--color-ink, #4a698d)' }}
                  >
                    {item.id_curso}
                  </span>

                  <span className="font-semibold text-sm" style={{ color: 'var(--color-blue-deep, #2b5f7a)' }}>
                    {item.curso}
                  </span>

                  <span className="text-xs font-mono" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
                    {item.universidade}
                  </span>

                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold w-fit px-2.5 py-1 rounded-full font-mono"
                    style={{ background: 'rgba(43,95,122,0.1)', color: 'var(--color-blue-deep, #2b5f7a)' }}
                  >
                    {parseFloat(item.nota_corte).toFixed(2)}
                  </span>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setSelected(item); setView('edit'); }}
                      className="text-xs font-semibold transition-colors hover:underline text-[var(--ink)]"
                    >
                      Editar
                    </button>
                    <span className="opacity-20 text-xs">|</span>
                    <button
                      onClick={() => handleDelete(item.id_curso)}
                      className="text-xs font-semibold text-[var(--vermelho)] hover:text-vermelho-600 transition-colors hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
