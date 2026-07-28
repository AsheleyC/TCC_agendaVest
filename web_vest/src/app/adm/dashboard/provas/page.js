'use client';

import { useState, useEffect } from 'react';
import SidebarAdm from '../../../../components/adm/SidebarAdm';
import ProvaForm from '../../../../components/adm/ProvaForm';
import { apiFetch } from '../../../../components/utils/api';

export default function ProvasPage() {
  const [provas, setProvas] = useState([]);
  const [vestibulares, setVestibulares] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega tanto as provas quanto os vestibulares para o formulário relacional
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resProvas, resVest] = await Promise.all([
        apiFetch('/verProvas'),
        apiFetch('/verVest'),
      ]);
      setProvas(resProvas || []);
      setVestibulares(resVest || []);
    } catch (e) {
      alert(`Erro ao processar dados: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (view === 'edit') {
        await apiFetch(`/atualProvas/${selected.id_prova}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/addProvas', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setView('list');
      loadAllData();
    } catch (e) {
      alert(`Erro ao salvar prova: ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta prova do acervo histórico permanentemente?')) return;
    try {
      await apiFetch(`/delProvas/${id}`, { method: 'DELETE' });
      loadAllData();
    } catch (e) {
      alert(`Erro ao remover prova: ${e.message}`);
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
              Acervo de Provas Anteriores
            </h1>
            <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--color-ink-light, #7a98b5)' }}>
              Gerencie arquivos de exames passados e os respectivos gabaritos.
            </p>
          </div>

          {view === 'list' && (
            <button
              onClick={() => { setSelected(null); setView('create'); }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'var(--color-blue-dark, #3d7a9a)' }}
            >
              <span className="text-base leading-none">+</span>
              Adicionar Prova
            </button>
          )}
        </div>

        {view !== 'list' ? (
          <div
            className="rounded-2xl border p-6 lg:p-10 shadow-sm max-w-2xl w-full"
            style={{ background: 'var(--color-card, #f4f8fc)', borderColor: 'var(--color-detail, #b9d8e1)' }}
          >
            <ProvaForm
              initialData={selected}
              vestibularesList={vestibulares}
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
            Sincronizando repositório de arquivos...
          </div>
        ) : (
          <div
            className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ background: 'var(--color-card, #f4f8fc)', borderColor: 'var(--color-detail, #b9d8e1)' }}
          >
            {/* Table header */}
            {/* Table header */}
            <div
              className="grid text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3.5 border-b"
              style={{
                // 💡 Proporção ajustada: dá espaço para os links respirarem e encolhe o "Ano"
                gridTemplateColumns: '56px 2fr 1fr 4fr 1.5fr',
                borderColor: 'var(--color-detail, #b9d8e1)',
                color: 'var(--color-ink-light, #7a98b5)',
                background: 'rgba(98,155,181,0.06)',
              }}
            >
              <span>ID</span>
              <span>Vestibular</span>
              <span>Ano</span>
              <span>Links de Consulta</span>
              <span className="text-right pr-10">Ações</span>
            </div>

            {/* Table body */}
            {/* Table body */}
{provas.length === 0 ? (
  <div className="py-16 text-center">
    <p className="text-sm font-semibold text-[var(--ink)]">
      Nenhuma prova anexada ao acervo histórico.
    </p>
  </div>
) : (
  provas.map((item, i) => (
    <div
      key={item.id_prova}
      className="grid items-center px-5 py-4 border-b transition-colors duration-150 hover:bg-[rgba(98,155,181,0.05)]"
      style={{
        // 💡 Mesma proporção exata do header
        gridTemplateColumns: '56px 2fr 1fr 4fr 1.5fr',
        borderColor: i === provas.length - 1 ? 'transparent' : 'var(--color-detail, #b9d8e1)',
      }}
    >
      <span
        className="font-mono text-xs font-bold opacity-40"
        style={{ color: 'var(--color-ink, #4a698d)' }}
      >
        {item.id_prova}
      </span>

      <span className="font-semibold text-sm" style={{ color: 'var(--color-blue-deep, #2b5f7a)' }}>
        {item.vestibular}
      </span>

      <span
        className="font-mono text-xs font-semibold"
        style={{ color: 'var(--color-ink-light, #7a98b5)' }}
      >
        {item.ano_prova}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={item.link_prova}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 hover:opacity-80"
          style={{ background: 'rgba(61,122,154,0.1)', color: 'var(--color-blue-dark, #3d7a9a)' }}
        >
          📄 Caderno
        </a>
        {item.link_gabarito && (
          <a
            href={item.link_gabarito}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 hover:opacity-80"
            style={{ background: 'rgba(43,95,122,0.1)', color: 'var(--color-blue-deep, #2b5f7a)' }}
          >
            ✅ Gabarito
          </a>
        )}
      </div>

      {/* 💡 Mudado de justify-center para justify-end para alinhar perfeitamente à direita */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => { setSelected(item); setView('edit'); }}
          className="text-xs font-semibold transition-colors hover:underline text-[var(--ink)]"
        >
          Editar
        </button>
        <span className="opacity-20 text-xs">|</span>
        <button
          onClick={() => handleDelete(item.id_prova)}
          className="text-xs font-semibold text-[var(--vermelho)] hover:text-red-600 transition-colors hover:underline"
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
