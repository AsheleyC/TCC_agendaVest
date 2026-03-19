export default function Home() {
  return (
    <div className="min-h-screen bg-[#e5ecf6] flex items-center justify-center text-[#4a698d] px-4">

      <div className="bg-[#b9d8e1] w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-8 sm:p-10 md:p-12 rounded-2xl shadow-xl">
        <br />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6">
          Bem-Vindo(a)
        </h1>

        <p className="text-left mb-6 text-lg">_____________</p>

        <p className="text-left mb-5 text-base sm:text-lg md:text-xl">
          Seja bem vindo a página inicial do aplicativo AgendaVest 💞
        </p>
        <p className="text-left mb-3 text-base sm:text-lg md:text-xl">
          • Organize seus estudos e alcance seus objetivos com mais facilidade.
        </p>
        <p className="text-left mb-3 text-base sm:text-lg md:text-xl">
          • Acompanhe seu progresso diariamente.
        </p>
        <p className="text-left mb-3 text-base sm:text-lg md:text-xl">
          • Alcance seus objetivos com mais foco
        </p>

        <br />
        <br />
        <div className="flex justify-center">
          <button className="bg-[#629bb5] text-white px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg md:text-xl rounded-xl shadow-lg hover:scale-105 hover:opacity-90 transition-all duration-300">
            Baixe Aqui
          </button>
        </div>

        <br />
      </div>

    </div>
  );
}
