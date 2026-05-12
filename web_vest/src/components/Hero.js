export default function Hero() {
  return (
    <section id="home" className="min-h-screen relative overflow-x-hidden flex flex-col pt-20">

      {/* Blobs */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(185,216,225,0.45)_0%,transparent_70%)] top-[-100px] right-[100px] blur-[80px] animate-blob  pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(98,155,181,0.2)_0%,transparent_70%)] bottom-[100px] left-[80px] blur-[80px] animate-blob-reverse  pointer-events-none"></div>
      <div className="absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(74,105,141,0.12)_0%,transparent_70%)] top-[40%] left-[40%] blur-[80px] animate-blob-delay  pointer-events-none"></div>

      {/* Container */}
      <div className="flex-1 max-w-full mx-auto px-6 py-20 grid md:grid-cols-2 gap-20 items-center">

        {/* Conteúdo */}
        <div className="animate-fadeUp">

          <div className="inline-flex items-center gap-2 bg-white border border-[--blue-btn] px-4 py-1 rounded-full text-sm mb-7 shadow">
            ENEM e vestibulares
          </div>

          <h1 className="font-serif text-[clamp(40px,5vw,64px)] leading-tight mb-6 text-[var(--dark)] font-bold">
            Todos os seus <br />
            <em className="text-[var(--blue-btn)] italic">vestibulares</em> <br />
            em um só lugar
          </h1>

          <p className="text-[17px] leading-relaxed text-[var(--dark-text)] opacity-80 max-w-[480px] mb-10">
            Chega de planilha, de aba aberta pra cada site, de perder prazo de inscrição.
            O AgendaVest centraliza os principais vestibulares do Brasil para você
            estudar com foco e se inscrever no tempo certo.
          </p>

          <div className="flex gap-4 flex-wrap items-center mb-5">
            <a className="bg-[var(--blue-btn)] hover:bg-[var(--text)] text-white font-semibold px-7 py-3 rounded-xl shadow-lg transition">
              Conhecer o app
            </a>
          </div>

        </div>

        {/* Mockup */}
        <div className="relative flex justify-center animate-fadeUp delay-200">

          <div className="w-[280px] bg-white rounded-[36px] p-5 shadow-2xl border relative z-10">

            <div className="flex flex-col gap-3">
              <div className="absolute top-[-5%] right-[-30%] bg-white border border-[var(--blue-btn)] px-4 py-2 rounded-full text-sm font-semibold text-[var(--dark)] shadow animate-chip">
                🎯 FUVEST · USP
              </div>

              <div className="absolute bottom-[25%] right-[-70%] bg-white border border-[var(--blue-btn)] px-4 py-2 rounded-full text-sm font-semibold text-[var(--dark)] shadow animate-chip-delay1">
                📚 Conteúdos + cobrados
              </div>

              <div className="absolute bottom-[5%] left-[-62%] bg-white border border-[var(--blue-btn)] px-4 py-2 rounded-full text-sm font-semibold text-[var(--dark)] shadow animate-chip-delay2">
                🔔 Notificações ativas
              </div>

              <div className="flex justify-between pb-3 border-b">
                <span className="font-serif text-gray-900">Minha Agenda</span>
                <span>🔔</span>
              </div>

              {/* Cards */}
              <div className="bg-gray-100 rounded-xl p-3 border text-sm">
                <div className="flex justify-between mb-1">
                  <span className="bg-blue-100 text-blue-600 text-[10px] px-2 rounded">FUVEST</span>
                  <span className="text-orange-400 text-xs">⚡ 12 dias</span>
                </div>
                <p className="text-gray-700">Inscrições encerram</p>
                <p className="text-gray-400 text-xs">📅 15 de novembro, 2025</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 border text-sm">
                <div className="flex justify-between mb-1">
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 rounded">UNICAMP</span>
                  <span className="text-gray-400 text-xs">Em 28 dias</span>
                </div>
                <p className="text-gray-700">Data da prova</p>
                <p className="text-gray-400 text-xs">📅 1 de dezembro, 2025</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 border text-sm">
                <div className="flex justify-between mb-1">
                  <span className="bg-orange-100 text-orange-600 text-[10px] px-2 rounded">VUNESP</span>
                  <span className="text-gray-400 text-xs">Em 45 dias</span>
                </div>
                <p className="text-gray-700">Data da prova</p>
                <p className="text-gray-400 text-xs">📅 18 de dezembro, 2025</p>
              </div>

              {/* Mapa */}
              <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl h-[80px] relative flex items-end p-2">
                <div className="absolute w-4 h-4 border border-2 border-[var(--bg)] bg-[var(--dark)] rounded-full top-[20%] left-[35%] animate-pulse"></div>
                <div className="absolute w-3 h-3 border border-2 border-[var(--bg)] bg-[var(--dark)] rounded-full top-[35%] left-[50%] animate-pulse"></div>
                <div className="bg-white text-xs px-2 py-1 rounded font-semibold">
                  🗺️ Mapa de Cortes
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="bg-[var(--blue-btn)] flex flex-wrap justify-center items-center py-7">

        <div className="px-12 text-center">
          <span className="block text-4xl text-[var(--bg)] font-serif">15+</span>
          <span className="text-sm text-[var(--bg)]">Vestibulares mapeados</span>
        </div>

        <div className="px-12 text-center">
          <span className="block text-4xl text-[var(--bg)] font-serif">10+</span>
          <span className="text-sm text-[var(--bg)]">Estados do Brasil</span>
        </div>

        <div className="px-12 text-center">
          <span className="block text-4xl text-[var(--bg)] font-serif">100%</span>
          <span className="text-sm text-[var(--bg)]">Gratuito</span>
        </div>

        <div className="px-12 text-center">
          <span className="block text-4xl text-[var(--bg)] font-serif">0</span>
          <span className="text-sm text-[var(--bg)]">Prazos perdidos</span>
        </div>

      </div>
    </section>
  )
}