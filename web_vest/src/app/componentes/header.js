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

                <ul className="flex space-x-10 ">
                    <li className="text-lg hover:underline">
                        <a href="/">Home</a>
                    </li>
                    <li className="text-lg hover:underline">
                        <a href="/sobre">Sobre</a>
                    </li>
                </ul>

            </nav>
        </header>
    )
}