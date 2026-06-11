const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiFetch = async (endpoint, options = {}) => {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('adm_token') || '';
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adm_token');
        window.location.href = '/adm';
      }
      throw new Error('Sessão expirada. Redirecionando...');
    }

    if (response.status === 204) return null;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensagem || errorData.message || `Erro do servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na API [${endpoint}]:`, error);
    throw error;
  }
};
