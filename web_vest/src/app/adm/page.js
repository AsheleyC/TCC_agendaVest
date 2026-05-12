'use client'

import { useState } from "react"

export default function AdminSection() {
  const  [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  console.log(email)

  return (
    <section id="adm" className="min-h-screen flex items-center justify-center pt-24 -mt-15">
      <div className="max-w-[480px] mx-auto text-center animate-fade-in">

        <div className="inline-block text-[13px] font-semibold tracking-widest uppercase text-[var(--blue-btn)] mb-4 font-bold">
          Área Administrativa
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-[var(--ink)] mb-4 font-bold">
          Acesso restrito para administradores
        </h2>

        <p className="text-[16px] text-[var(--text)] leading-[1.7] opacity-85 mb-7">
          Esta área é destinada exclusivamente à equipe AgendaVest para gerenciar vestibulares, usuários e conteúdos.
        </p>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(98,155,181,0.2)] shadow-sm">

          {/* Email */}
          <div className="mb-5 text-left">
            <label className="text-[0.8rem] font-semibold text-[var(--ink)] block mb-[0.4rem] text-left">
              E-mail
            </label>
            <input
              type="email"
              placeholder="adm@agendavest.com.br"
              className="w-full px-4 py-3 border border-[rgba(98,155,181,0.3)] rounded-xl text-sm text-[var(--ink)] bg-[var(--bg)] outline-none font-sans"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            
            />
          </div>

          {/* Senha */}
          <div className="mb-6 text-left">
            <label className="text-[0.8rem] font-semibold text-[var(--ink)] block mb-[0.4rem] text-left">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              className="w-full px-4 py-3 border border-[rgba(98,155,181,0.3)] rounded-xl text-sm text-[var(--ink)] bg-[var(--bg)] outline-none font-sans"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {/* Botão */}
          <button className="w-full flex justify-center items-center bg-[var(--blue-btn)] text-white py-3 rounded-full font-semibold text-base transition hover:-translate-y-0.5 hover:opacity-90">
            Entrar como ADM
          </button>

          <p className="text-xs text-[var(--text)] leading-[1.7] opacity-85 mt-4">
            Acesso restrito. Problemas? Entre em contato com o suporte técnico.
          </p>
        </div>
      </div>
    </section>
  )
}