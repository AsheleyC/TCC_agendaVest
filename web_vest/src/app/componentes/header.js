export default function Header() {
    return (
        <header className="bg-[#b9d8e1] text-[#4a698d]">
            <nav className="flex items-center justify-between px-10 py-3">

                <div className="flex items-center gap-3">
                    <img
                        src="https://www.designevo.com/res/templates/thumb_small/simple-black-and-white-font-style.webp"
                        className="w-14 h-14 rounded-full"
                    />

                    <h1 className="text-2xl">
                        AgendaVest
                    </h1>
                </div>

                <ul className="flex iems-center space-x-10">
                    <li className="text-lg hover:underline leading-10">
                        <a href="/">Home</a>
                    </li>
                    <li className="text-lg hover:underline leading-10">
                        <a href="/sobre">Sobre</a>
                    </li>
                    <a href="/login" className="bg-[#629bb5] text-white px-4 py-2 rounded-3xl hover:scale-105 hover:opacity-90 transition-all duration-300">Sou Administrador</a>
                </ul>
            </nav>
        </header>
    )
}