import CardSobre from "../componentes/cardSobre"

export default function Sobre() {
    return (
        <div className="min-h-screen flex flex-col bg-[#e5ecf6] text-[#4a698d] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10 md:py-16">

            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-3 text-center md:text-left">
                SOBRE O AGENDAVEST
            </h1>

            <h3 className="text-base md:text-lg lg:text-xl text-center md:text-left">
                Da dificuldade de encontrar qual curso escolher, qual faculdade ingressar e como estudar e se organizar nasceu o AgendaVest.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
                <CardSobre titulo="Busca de Vestibulares" texto="Navegue pelos principais vestibulares da região Sudeste, visualizando informações rápidas antes de acessar detalhes completos." />
                <CardSobre titulo="Agenda Personalizada" texto="Acompanhe apenas os vestibulares selecionados por você, com foco total nas suas escolhas e nas próximas etapas de cada processo." />
                <CardSobre titulo="Informações completas por vestibular" texto="Acesse páginas dedicadas com dados essenciais como datas, taxas, provas anteriores e orientações para cada processo seletivo." />
                <CardSobre titulo="Conteúdos mais cobrados" texto="Descubra os assuntos que mais caem em cada vestibular e direcione seus estudos de forma estratégica e eficiente." />
                <CardSobre titulo="Mapa Interativo" texto="Pesquise cursos e visualize, em um mapa dinâmico, as instituições da região com suas respectivas notas de corte." />
                <CardSobre titulo="Acesso como visitante" texto="Utilize o aplicativo sem a necessidade de cadastro, com acesso às funcionalidades básicas para explorar vestibulares e informações gerais." />
            </div>
        </div>
    )
}