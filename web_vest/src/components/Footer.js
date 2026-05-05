export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">

        {/* TOP */}
        <div className="grid md:grid-cols-2 gap-16 mb-12 pb-12 border-b border-white/10 justify-items-center text-center md:text-left">

          {/* BRAND */}
          <div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-serif text-xl">
                Agenda<span className="text-[var(--blue-btn)]">Vest</span>
              </span>
            </div>

            <p className="text-sm text-white/55 leading-relaxed">
              Sua jornada até a faculdade começa aqui.
            </p>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* COL 1 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[var(--detail)]">
                App
              </span>
              <a href="#home" className="text-sm text-white/60 hover:text-white transition">
                Home
              </a>
              <a href="#sobre" className="text-sm text-white/60 hover:text-white transition">
                Sobre
              </a>
              <a href="#funcionalidades" className="text-sm text-white/60 hover:text-white transition">
                Funcionalidades
              </a>
              <a href="#como-funciona" className="text-sm text-white/60 hover:text-white transition">
                Como funciona
              </a>
            </div>

            {/* COL 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[var(--detail)]">
                Conta
              </span>
              <a href="#login" className="text-sm text-white/60 hover:text-white transition">
                Entrar
              </a>
              <a href="#cadastro" className="text-sm text-white/60 hover:text-white transition">
                Cadastrar
              </a>
              <a href="#vestibulares" className="text-sm text-white/60 hover:text-white transition">
                Acesso visitante
              </a>
              <a href="/adm" className="text-sm text-white/60 hover:text-white transition">
                Área ADM
              </a>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center md:text-left">

          <p className="text-xs text-white/45">
          © 2026 AgendaVest • Desenvolvido por Asheley Tombolo e Beatriz Giacomini
          </p>

        </div>
      </div>
    </footer>
  )
}