'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
          ? 'bg-[rgba(229,236,246,0.95)] backdrop-blur-md py-3 shadow-[0_2px_20px_rgba(74,105,141,0.1)]'
          : 'py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">

        {/* LOGO */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl">
            Agenda<span className="text-[var(--blue-btn)]">Vest</span>
          </span>
        </a>

        {/* LINKS */}
        <ul
          className={`flex ml-auto list-none md:flex-row md:static md:gap-12 fixed md:translate-y-0 top-16 left-0 right-0 flex-col p-6 gap-6 transition-transform duration-300
            ${menuOpen ? 'translate-y-0' : '-translate-y-[120%]'}
            `}
        >
          {['Home', 'Sobre', 'Funcionalidades', 'Como funciona'].map((item, i) => (
            <li key={i}>
              <Link
                href={`/#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[var(--text)] relative transition-colors hover:text-[var(--blue-btn)] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-[var(--blue-btn)] after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* BOTÃO ADMIN */}
        <a
          href="/adm"
          className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-3xl bg-[var(--blue-btn)] border border-[var(--blue-btn)] text-[var(--bg)] transition-all hover:bg-[var(--detail)] hover:text-[var(--blue-btn)]">
          Área ADM
        </a>

        {/* HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] ml-auto p-1"
          aria-label="Menu"
        >
          <span className={`block w-6 h-[2px] bg-[var(--dark)] transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--dark)] transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-[var(--dark)] transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
        </button>

      </div>
    </nav>
  )
}