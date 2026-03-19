export default function CardSobre({titulo, texto, altura}){
    return(
        <div className="flex flex-col p-3  pt-7 bg-[#b9d8e1] w-100 h-70 text-[#4a698d] text-justify rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition duration-300">
            <h1 className="text-center text-2xl font-semibold">{titulo}</h1>
            <p>___________________________________________</p>
            <br></br>
            <h3 className="text-xl">{texto}</h3>
        </div>
    )
}