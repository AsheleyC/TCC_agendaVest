export default function CardSobre({ titulo, texto }) {
    return (
        <div className="flex flex-col p-4 pt-6 bg-[#b9d8e1] w-full text-[#4a698d] text-justify rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition duration-300">
            <h1 className="text-center text-lg md:text-xl lg:text-2xl font-semibold">
                {titulo}
            </h1>
            <hr className="my-2 border-[#4a698d]" />
            <h3 className="text-sm md:text-base lg:text-lg">
                {texto}
            </h3>
        </div>
    )
}