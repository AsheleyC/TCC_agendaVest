export default function Login() {
    return (
        <div className="flex flex-col bg-[#e5ecf6] text-[#4a698d] w-full items-center justify-center">
            <div className="bg-[#b9d8e1] w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-8 sm:p-10 md:p-12 rounded-2xl shadow-xl">
                <h1 className="text-center text-2xl pb-5">ADMINISTRADOR</h1>
                <div className="flex flex-col gap-2">
                    <label className="text-xl" htmlFor="email">E-MAIL</label>
                    <input
                        className="border-2 border-[#56849b] w-full h-11 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        id="email"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xl" htmlFor="login">SENHA</label>
                    <input
                        className="border-2 border-[#56849b] w-full h-11 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        id="login"
                    />
                </div>

                <div className="flex justify-center mt-6">
                    <button className="bg-[#56849b] px-8 py-3 text-white rounded-3xl hover:bg-[#4a7387] hover:scale-105 transition shadow-md">Entrar</button>
                </div>
            </div>
        </div>
    )
}