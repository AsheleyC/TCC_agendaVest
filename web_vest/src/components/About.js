export default function About() {
  return (
    <section id="sobre" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto relative">

        <img
          src="/Formatura.png"
          alt="Formatura"
          className="hidden md:block absolute right-35 top-0 w-[300px] opacity-90"
        />

        {/* TEXTO */}
        <div>
          <span className="inline-block text-[13px] font-semibold tracking-widest uppercase text-[var(--blue-btn)] mb-4 font-bold">
            Sobre o AgendaVest
          </span>

          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-tight text-[var(--dark)] mb-6 font-bold">
            Nascido da frustração <br />
            <em className="italic text-[var(--blue-btn)]">
              de quem já passou por isso
            </em>
          </h2>

          <p className="text-base leading-relaxed text-[var(--dark)] opacity-90">
            Da dificuldade de encontrar qual curso escolher, qual faculdade ingressar
            e como estudar e se organizar — nasceu o AgendaVest.
          </p>

          <p className="text-base leading-relaxed text-[var(--dark)] mb-4 opacity-90">
            Reunimos os principais vestibulares do Brasil em um único ambiente.
            Tudo para você parar de perder prazo e começar a estudar com estratégia.
          </p>
        </div>
      </div>
    </section>
  )
}