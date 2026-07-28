'use client';

import { useState, useEffect } from 'react';

export default function VestibularForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    vestibular: '',
    data_inicio_inscricao: '',
    data_fim_inscricao: '',
    data_prova: '',
    taxa_prova: '',
    link_edital: ''
  });

  useEffect(() => {
    if (initialData) {
      const formatDate = (d) => d ? d.split('T')[0] : '';
      setFormData({
        vestibular: initialData.vestibular || '',
        data_inicio_inscricao: formatDate(initialData.data_inicio_inscricao),
        data_fim_inscricao: formatDate(initialData.data_fim_inscricao),
        data_prova: formatDate(initialData.data_prova),
        taxa_prova: initialData.taxa_prova ? parseFloat(initialData.taxa_prova).toFixed(2) : '',
        link_edital: initialData.link_edital || ''
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
      vestibular: formData.vestibular,
      dt_inicio: formData.data_inicio_inscricao,
      dt_fim: formData.data_fim_inscricao,
      dt_prova: formData.data_prova,
      taxa: formData.taxa_prova ? parseFloat(formData.taxa_prova) : 0,
      link: formData.link_edital
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
    // 💡 Alterado para w-full e limpo backgrounds, borders, shadows e max-w-2xl
    <div className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      
      {/* Body */}
      {/* 💡 Removido px-7 py-6 para os campos não ficarem esmagados nas margens do card maior */}
      <form onSubmit={handleSubmit} className="pt-6 flex flex-col gap-5">
  
        {/* Nome */}
        <div>
          <label style={labelStyle}>Nome do Vestibular <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
          <input
            type="text" name="vestibular" required value={formData.vestibular} onChange={handleChange}
            placeholder="Ex: FUVEST 2026"
            className={inputClass} style={inputStyle} {...inputFocusHandlers}
          />
        </div>
  
        {/* Datas — 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Início da Inscrição <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input type="date" name="data_inicio_inscricao" required value={formData.data_inicio_inscricao} onChange={handleChange}
              className={inputClass} style={inputStyle} {...inputFocusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>Fim da Inscrição <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input type="date" name="data_fim_inscricao" required value={formData.data_fim_inscricao} onChange={handleChange}
              className={inputClass} style={inputStyle} {...inputFocusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>Data da Prova <span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input type="date" name="data_prova" required value={formData.data_prova} onChange={handleChange}
              className={inputClass} style={inputStyle} {...inputFocusHandlers} />
          </div>
        </div>
  
        {/* Taxa + Link — 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Taxa de Inscrição (R$)<span style={{ color: 'var(--color-blue, #629bb5)' }}>*</span></label>
            <input type="number" step="0.01" name="taxa_prova" value={formData.taxa_prova} onChange={handleChange}
              placeholder="0.00" className={inputClass} style={inputStyle} {...inputFocusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>URL do Edital</label>
            <input type="url" name="link_edital" value={formData.link_edital} onChange={handleChange}
              placeholder="https://..." className={inputClass} style={inputStyle} {...inputFocusHandlers} />
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
            Confirmar Salvamento
          </button>
        </div>
      </form>
    </div>
  );
}
