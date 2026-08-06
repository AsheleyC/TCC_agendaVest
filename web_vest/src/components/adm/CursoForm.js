'use client';

import { useState, useEffect } from 'react';

export default function CursoForm({ initialData, universidadesList, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id_universidade: '',
    curso: '',
    nota_corte: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id_universidade: initialData.id_universidade || '',
        curso: initialData.curso || '',
        nota_corte: initialData.nota_corte ? parseFloat(initialData.nota_corte).toFixed(2) : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id_universidade: parseInt(formData.id_universidade),
      curso: formData.curso,
      nota_corte: parseFloat(formData.nota_corte)
    });
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150";
  const inputStyle = {
    background: '#fff',
    border: '1.5px solid var(--color-detail, #b9d8e1)',
    color: 'var(--color-ink, #4a698d)',
    fontFamily: 'Inter, sans-serif',
  };
  const inputFocusHandlers = {
    onFocus: e => { e.currentTarget.style.borderColor = 'var(--color-blue, #629bb5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(98,155,181,0.15)'; },
    onBlur:  e => { e.currentTarget.style.borderColor = 'var(--color-detail, #b9d8e1)'; e.currentTarget.style.boxShadow = 'none'; },
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    color: 'var(--color-ink-light, #7a98b5)',
    fontFamily: 'Inter, sans-serif',
  };
  return (
    // 💡 Removemos o background, border, shadow e max-width daqui
    <div className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Body */}
      {/* 💡 Removemos o padding px-7 py-6 para não duplicar o espaçamento interno */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Curso + Nota — 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Nome do Curso <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input
              type="text" name="curso" required value={formData.curso} onChange={handleChange}
              placeholder="Ex: Engenharia de Computação"
              className={inputClass} style={inputStyle} {...inputFocusHandlers}
            />
          </div>
          <div>
          <label style={labelStyle}>Nota de Corte Último Ano <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
          <input
            type="number" step="0.01" name="nota_corte" required value={formData.nota_corte} onChange={handleChange}
            min="0"
            placeholder="0.00"
            className={inputClass}
            style={{ ...inputStyle}}
            {...inputFocusHandlers}
          />
        </div>
        </div>

        {/* Universidades */}
        <div>
            <label style={labelStyle}>Universidade <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <select
              name="id_universidade" required value={formData.id_universidade} onChange={handleChange}
              className={inputClass}
              style={{ ...inputStyle, cursor: 'pointer' }}
              {...inputFocusHandlers}
            >
              <option value="">Selecione a Universidade</option>
              {universidadesList.map(u => (
                <option key={u.id_universidade} value={u.id_universidade}>
                  {u.universidade}
                </option>
              ))}
            </select>
          </div>

        {/* Actions */}
        <div
          className="flex justify-end gap-3 pt-4"
          style={{ borderTop: '1.5px solid var(--color-detail, #b9d8e1)' }}
        >
          <button
            type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              border: '1.5px solid var(--color-detail, #b9d8e1)',
              color: 'var(--color-ink, #4a698d)',
              background: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg, #e5ecf6)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150"
            style={{ background: 'var(--color-blue-dark, #3d7a9a)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-blue-deep, #2b5f7a)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-blue-dark, #3d7a9a)'}
          >
            Salvar Curso
          </button>
        </div>
      </form>
    </div>
  );

}
