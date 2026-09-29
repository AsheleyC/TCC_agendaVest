export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white px-6 pt-20 pb-10">
      <div className="max-w-6xl mx-auto">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-around items-center md:items-start gap-12 mb-12 pb-12 border-b border-white/20 text-center md:text-left">

          {/* BRAND */}
          <div className="flex flex-col gap-4 items-center md:items-start max-w-sm">
            <span className="font-serif text-2xl text-white font-bold">
              Agenda
              <span className="text-[var(--blue-footer)]">
                Vest
              </span>
            </span>

            <p className="text-sm text-white leading-relaxed">
              Sua jornada até a faculdade começa aqui.
            </p>

            {/* CTA */}
            <a
              href="#home"
              className="mt-2 inline-block bg-white text-[var(--ink)] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[var(--detail)] transition"
            >
              Começar agora
            </a>
          </div>

          {/* LINKS */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="text-sm font-bold tracking-widest uppercase text-white">
              App
            </span>

            <a
              href="#home"
              className="text-sm text-white hover:underline transition"
            >
              Home
            </a>

            <a
              href="#sobre"
              className="text-sm text-white hover:underline transition"
            >
              Sobre
            </a>

            <a
              href="#funcionalidades"
              className="text-sm text-white hover:underline transition"
            >
              Funcionalidades
            </a>

            <a
              href="#como-funciona"
              className="text-sm text-white hover:underline transition"
            >
              Como funciona
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex justify-center text-center">
          <p className="text-sm text-white">
            © 2026 AgendaVest • Desenvolvido por Asheley Tombolo e Beatriz Giacomini
          </p>
        </div>
      </div>
    </footer>
  )
}