'use client'

import Navbar from "@/components/Navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminSection() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const router = useRouter()

  const url_back =
    process.env.NEXT_PUBLIC_API_URL

  async function logar() {
    if (!email.trim() || !senha.trim()) {
      alert("Preencha e-mail e senha")
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        `${url_back}/loginADM`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email: email.trim(),
            senha: senha.trim()
          })
        }
      )

      const resultado =
        await resposta.json()

      if (!resposta.ok) {
        alert(
          `${resultado.erro || resultado.mensagem}\n${resultado.detalhe || ''}`
        )

        return
      }

      localStorage.setItem(
        'tokenAdm',
        resultado.token
      )

      router.replace(
        "/adm/dashboard"
      )

    } catch (erro) {
      alert(
        "Não foi possível conectar ao servidor."
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section
      id="adm"
      className="min-h-screen flex items-center justify-center pt-24 -mt-15"
    >
      <Navbar />

      <div className="max-w-[480px] mx-auto text-center animate-fade-in">

        <div className="inline-block text-[13px] tracking-widest uppercase text-[var(--blue-btn)] mb-4 font-bold">
          Área Administrativa
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-[var(--ink)] mb-4 font-bold">
          Acesso restrito para administradores
        </h2>

        <p className="text-[16px] text-[var(--text)] leading-[1.7] opacity-85 mb-7">
          Esta área é destinada exclusivamente à equipe AgendaVest para gerenciar vestibulares, usuários e cursos.
        </p>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(98,155,181,0.2)] shadow-sm">

          <div className="mb-5 text-left">
            <label className="text-[0.8rem] font-semibold text-[var(--ink)] block mb-[0.4rem]">
              E-mail
            </label>

            <input
              type="email"
              placeholder="email@email.com"
              className="w-full px-4 py-3 border border-[rgba(98,155,181,0.3)] rounded-xl text-sm text-[var(--ink)] bg-[var(--bg)] outline-none font-sans"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  logar()
                }
              }}
            />
          </div>

          <div className="mb-6 text-left">
            <label className="text-[0.8rem] font-semibold text-[var(--ink)] block mb-[0.4rem] text-left">
              Senha
            </label>

            <input
              type="password"
              placeholder="••••••••••"
              className="w-full px-4 py-3 border border-[rgba(98,155,181,0.3)] rounded-xl text-sm text-[var(--ink)] bg-[var(--bg)] outline-none font-sans"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  logar()
                }
              }}
            />
          </div>

          <button
            className="w-full flex justify-center items-center bg-[var(--blue-btn)] text-white py-3 rounded-full font-semibold text-base transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
            onClick={logar}
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar como ADM'}
          </button>

          <p className="text-xs text-[var(--text)] leading-[1.7] opacity-85 mt-4">
            Acesso restrito. Problemas? Entre em contato com o suporte técnico.
          </p>
        </div>
      </div>
    </section>
  )
}