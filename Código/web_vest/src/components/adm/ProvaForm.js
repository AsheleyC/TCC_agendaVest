'use client';

import { useState, useEffect } from 'react';

export default function ProvaForm({ initialData, vestibularesList, onSubmit, onCancel }) {

  const [erroAno, setErroAno] = useState('');

  const [formData, setFormData] = useState({
    id_vestibular: '',
    link_prova: '',
    link_gabarito: '',
    ano_prova: new Date().getFullYear()
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id_vestibular: initialData.id_vestibular || '',
        link_prova: initialData.link_prova || '',
        link_gabarito: initialData.link_gabarito || '',
        ano_prova: initialData.ano_prova || new Date().getFullYear()
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'ano_prova') {
      const anoAtual = new Date().getFullYear();

      if (value && parseInt(value) > anoAtual) {
        setErroAno(`O ano da prova não pode ser posterior a ${anoAtual}`);
      } else {
        setErroAno('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id_vestibular: parseInt(formData.id_vestibular),
      ano_prova: parseInt(formData.ano_prova)
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
    onBlur: e => { e.currentTarget.style.borderColor = 'var(--color-detail, #b9d8e1)'; e.currentTarget.style.boxShadow = 'none'; },
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
    // Mudado para w-full e removido backgrounds, borders, shadows e max-w-2xl
    <div className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Body */}
      {/* Removido px-7 py-6 para os campos não ficarem esmagados nas bordas */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Vestibular + Ano — 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Vestibular Pertencente <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <select
              name="id_vestibular" required value={formData.id_vestibular} onChange={handleChange}
              className={inputClass}
              style={{ ...inputStyle, cursor: 'pointer' }}
              {...inputFocusHandlers}
            >
              <option value="">Selecione o Vestibular</option>
              {vestibularesList.map(v => (
                <option key={v.id_vestibular} value={v.id_vestibular}>{v.vestibular}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Ano de Aplicação{' '}
              <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span>
            </label>

            <input
              type="number"
              name="ano_prova"
              required
              value={formData.ano_prova}
              onChange={handleChange}
              min="1990"
              max={new Date().getFullYear()}
              className={inputClass}
              style={{
                ...inputStyle,
                borderColor: erroAno ? '#e74c3c' : inputStyle.border
              }}
              {...inputFocusHandlers}
            />
          </div>
        </div>

        {/* Links — 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Caderno de Questões (PDF) <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input
              type="url" name="link_prova" required value={formData.link_prova} onChange={handleChange}
              placeholder="https://..."
              className={inputClass} style={inputStyle} {...inputFocusHandlers}
            />
          </div>
          <div>
            <label style={labelStyle}>Gabarito Oficial (PDF)</label>
            <input
              type="url" name="link_gabarito" value={formData.link_gabarito} onChange={handleChange}
              placeholder="https://..."
              className={inputClass} style={inputStyle} {...inputFocusHandlers}
            />
          </div>
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
            Salvar Histórico
          </button>
        </div>
      </form>
    </div>
  );
}
