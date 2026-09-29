export default function Steps() {
  const steps = [
    {
      num: "01",
      icon: "fa-sign-in",
      title: "Acesse ou cadastre-se",
      desc: "Crie sua conta ou entre como visitante para explorar o AgendaVest. Usuários cadastrados podem adicionar vestibulares à agenda e acompanhar seus processos seletivos.",
    },
    {
      num: "02",
      icon: "fa-search",
      title: "Explore os vestibulares",
      desc: "Navegue pelos principais vestibulares da região Sudeste, utilize a pesquisa e os filtros e acompanhe a situação atual de cada processo seletivo.",
    },
    {
      num: "03",
      icon: "fa-calendar-plus-o",
      title: "Adicione à sua agenda",
      desc: "Escolheu um vestibular? Adicione-o à sua agenda personalizada para acompanhar as datas importantes e acessar suas informações com facilidade.",
    },
    {
      num: "04",
      icon: "fa-file-text-o",
      title: "Consulte provas anteriores",
      desc: "Acesse provas e gabaritos de edições anteriores dos vestibulares disponíveis para conhecer melhor o formato de cada processo seletivo.",
    },
    {
      num: "05",
      icon: "fa-map-o",
      title: "Explore o mapa",
      desc: "Pesquise cursos e visualize no mapa instituições da região Sudeste, suas notas de corte e opções organizadas por proximidade.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-28 px-6 bg-[var(--bg)]"
    >
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block text-[14px] font-semibold tracking-widest uppercase text-[var(--blue-text)] mb-4">
            Como funciona
          </span>

          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-tight text-[var(--dark)] mb-4 tracking-tight font-bold">
            Seu caminho até a aprovação,<br />
            <span className="text-[var(--blue-text)]">
              organizado
            </span>
          </h2>

          <p className="text-base text-[var(--dark)] leading-7">
            Uma jornada simples, do primeiro acesso até o dia da prova, sem nenhuma etapa desnecessária.
          </p>
        </div>

        {/* STEPS */}
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex gap-6 sm:gap-7 items-start"
            >

              {/* LEFT */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--blue-btn)] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-[rgba(98,155,181,0.35)]">
                  {s.num}
                </div>

                {i < steps.length - 1 && (
                  <div className="w-px h-16 bg-gradient-to-b from-[var(--blue-btn)] to-[var(--detail)] opacity-50 my-1" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1 bg-white border border-[var(--blue-btn)] rounded-2xl p-5 sm:p-6 mb-3 transition-all duration-200 hover:shadow-lg hover:border-[var(--blue-btn)] hover:translate-x-1">

                <div className="w-10 h-10 rounded-lg bg-[var(--detail)] flex items-center justify-center mb-3">
                  <i
                    className={`fa ${s.icon} text-[20px] text-[var(--blue-text)]`}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="font-serif text-lg text-[var(--dark)] mb-2">
                  {s.title}
                </h3>

                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {s.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}