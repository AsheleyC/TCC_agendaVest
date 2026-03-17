export default function Header() {
    return (
        <header className="bg-[#b9d8e1] text-[#4a698d]">
            <nav className="flex items-center justify-between px-6 py-2 relative">
                <div>
                    <img 
                        src="https://www.designevo.com/res/templates/thumb_small/simple-black-and-white-font-style.webp" 
                        className="w-12 h-12 rounded-full"
                    />
                </div>

                <ul className="flex space-x-10 absolute left-1/2 -translate-x-1/2">
                    <li className="text-lg hover:underline">
                        <a href="/">Home</a>
                    </li>
                    <li className="text-lg hover:underline">
                        <a href="/sobre">Sobre</a>
                    </li>
                </ul>

                <div className="w-12"></div>
            </nav>
        </header>
    )
}