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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/verVest');
      setData(res || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (payload) => {
    try {
      if (view === 'edit') {
        await apiFetch(`/atualVest/${selected.id_vestibular}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/cadVest', { method: 'POST', body: JSON.stringify(payload) });
      }
      setView('list');
      fetchItems();
    } catch (e) {
       if (e.status === 400) {
    alert(e.message);
  } else {
    alert("Ocorreu um erro interno. Tente novamente mais tarde.");
    console.error(e);
  }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja de fato remover permanentemente este registro?')) return;
    try {
      await apiFetch(`/delVest/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (e) {
      alert(e.message);
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
              Vestibulares Disponibilizados
            </h1>
            <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
              Insira, edite e acompanhe os dados e links de editais.
            </p>
          </div>

          {view === 'list' && (
            <button
              onClick={() => { setSelected(null); setView('create'); }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'var(--color-blue-dark, #3d7a9a)' }}
            >
              <span className="text-base leading-none">+</span>
              Cadastrar Vestibular
            </button>
          )}
        </div>

        {view !== 'list' ? (
          <div
            className="rounded-2xl border pt-5 pb-6 px-6 lg:pt-6 lg:pb-8 lg:px-10 shadow-sm max-w-2xl w-full"
            style={{ background: 'var(--color-card, #f4f8fc)', borderColor: 'var(--color-detail, #b9d8e1)' }}
          >
            <VestibularForm initialData={selected} onSubmit={handleSave} onCancel={() => setView('list')} />
          </div>
        ) : loading ? (
          <div className="flex items-center gap-3 text-sm opacity-60" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Buscando dados no servidor MVC...
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
                gridTemplateColumns: '56px 1fr 1fr 1fr 120px',
                borderColor: 'var(--color-detail, #b9d8e1)',
                color: 'var(--color-ink-light, #7a98b5)',
                background: 'rgba(98,155,181,0.06)',
              }}
            >
              <span>ID</span>
              <span>Nome do Vestibular</span>
              <span>Período Inscrição</span>
              <span>Data Prova</span>
              <span className="text-center">Ações</span>
            </div>

            {/* Table body */}
            {data.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  Nenhum vestibular cadastrado.
                </p>
              </div>
            ) : (
              data.map((item, i) => (
                <div
                  key={item.id_vestibular}
                  className="grid items-center px-5 py-4 border-b transition-colors duration-150 hover:bg-[rgba(98,155,181,0.05)]"
                  style={{
                    gridTemplateColumns: '56px 1fr 1fr 1fr 120px',
                    borderColor: i === data.length - 1 ? 'transparent' : 'var(--color-detail, #b9d8e1)',
                  }}
                >
                  <span
                    className="font-mono text-xs font-bold opacity-40"
                    style={{ color: 'var(--color-ink, #4a698d)' }}
                  >
                    {item.id_vestibular}
                  </span>

                  <span className="font-semibold text-sm" style={{ color: 'var(--color-blue-deep, #2b5f7a)' }}>
                    {item.vestibular}
                  </span>

                  <span className="text-xs" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
                    {new Date(item.data_inicio_inscricao).toLocaleDateString('pt-BR')}
                    {' – '}
                    {new Date(item.data_fim_inscricao).toLocaleDateString('pt-BR')}
                  </span>

                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(61,122,154,0.1)', color: 'var(--color-blue-dark, #3d7a9a)' }}
                  >
                    {new Date(item.data_prova).toLocaleDateString('pt-BR')}
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
                      onClick={() => handleDelete(item.id_vestibular)}
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
