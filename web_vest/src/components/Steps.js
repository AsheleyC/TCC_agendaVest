export default function Steps() {
  const steps = [
    {
      num: "01",
      icon: "🔐",
      title: "Acesse ou cadastre-se",
      desc: "Crie sua conta em segundos ou entre como visitante para explorar sem compromisso. Quem se cadastra tem acesso à agenda completa e notificações.",
    },
    {
      num: "02",
      icon: "🔍",
      title: "Explore os vestibulares",
      desc: "Navegue pela lista de vestibulares do Brasil. Clique para ver um resumo rápido e, se quiser, acesse a página completa com datas, taxas e provas anteriores.",
    },
    {
      num: "03",
      icon: "➕",
      title: "Adicione à sua agenda",
      desc: "Escolheu um vestibular? Adicione-o à sua agenda personalizada. Ele aparecerá na aba \"Minhas Inscrições\" com todas as datas que importam.",
    },
    {
      num: "04",
      icon: "🔔",
      title: "Receba notificações",
      desc: "O AgendaVest te avisa antes do encerramento das inscrições e antes do dia da prova. Sem surpresas, sem prazos perdidos.",
    },
    {
      num: "05",
      icon: "🗺️",
      title: "Explore o mapa de cortes",
      desc: "Pesquise pelo seu curso dos sonhos e veja no mapa quais instituições do Brasil oferecem a grade, com as notas de corte de cada uma.",
    },
  ];

  return (
    <section id="como-funciona" className="py-28 px-6 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block text-[13px] font-semibold tracking-widest uppercase text-[var(--blue-btn)] mb-4">
            Como funciona
          </span>

          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-tight text-[var(--dark)] mb-4 tracking-tight font-bold">
            Seu caminho até a aprovação,<br />
            <span className="text-[var(--blue-btn)]">organizado</span>
          </h2>

          <p className="text-base text-[var(--dark)] leading-7 opacity-80">
            Uma jornada simples, do primeiro acesso até o dia da prova, sem nenhuma etapa desnecessária.
          </p>
        </div>

        {/* STEPS */}
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-6 sm:gap-7 items-start">

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
                <div className="text-2xl mb-2">{s.icon}</div>

                <h3 className="font-serif text-lg text-[var(--dark)] mb-2">
                  {s.title}
                </h3>

                <p className="text-sm text-[var(--text)] opacity-80 leading-relaxed">
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