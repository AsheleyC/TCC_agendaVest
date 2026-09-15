export default function Features() {
  const features = [
    {
      icon: 'fa-search',
      title: 'Busca de Vestibulares',
      desc: 'Navegue pelos principais vestibulares da região Sudeste, visualizando informações rápidas antes de acessar detalhes completos.',
      color: '#e8f4f8',
    },
    {
      icon: 'fa-calendar-check-o',
      title: 'Agenda Personalizada',
      desc: 'Acompanhe apenas os vestibulares selecionados por você, com foco total nas suas escolhas e nas próximas etapas de cada processo.',
      color: '#f0f7ee',
    },
    {
      icon: 'fa-file-text-o',
      title: 'Informações completas',
      desc: 'Acesse páginas dedicadas com dados essenciais, como datas de inscrição, datas das provas, taxas, editais e outras informações importantes.',
      color: '#fdf3e7',
    },
    {
      icon: 'fa-book',
      title: 'Provas Anteriores',
      desc: 'Consulte provas e gabaritos de edições anteriores dos vestibulares disponíveis e conheça melhor o formato de cada processo seletivo.',
      color: '#f5eef8',
    },
    {
      icon: 'fa-map-o',
      title: 'Mapa Interativo',
      desc: 'Pesquise cursos e visualize no mapa instituições da região Sudeste, suas notas de corte e opções ordenadas por proximidade.',
      color: '#e8f0f8',
    },
    {
      icon: 'fa-user-o',
      title: 'Acesso como visitante',
      desc: 'Explore o aplicativo sem cadastro e consulte vestibulares, informações gerais, provas anteriores e outras funcionalidades disponíveis ao visitante.',
      color: '#fef9e7',
    },
  ];

  return (
    <section
      id="funcionalidades"
      className="py-28 px-6 bg-[var(--detail)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block text-[13px] font-semibold tracking-widest uppercase text-[var(--blue-btn)] mb-4">
            Funcionalidades
          </span>

          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-tight text-[var(--dark)] mb-4 tracking-tight">
            Tudo que você precisa <br />
            para não perder nenhum prazo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-[var(--bg)] rounded-2xl p-8 border border-[var(--blue-btn)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--blue-btn)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--blue-btn)] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: f.color }}
              >
                <i
                  className={`fa ${f.icon} text-[24px] text-[var(--blue-btn)]`}
                  aria-hidden="true"
                />
              </div>

              <h3 className="font-serif text-xl text-[var(--dark)] mb-2">
                {f.title}
              </h3>

              <p className="text-sm text-[var(--text)] leading-7 opacity-80">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}