
import { useState } from 'react'
import { ShieldCheck, Languages, ChevronDown } from 'lucide-react'

import LoginForm from '../components/login-form'
import BrandLogo from '../components/brand-logo'
import '../styles/login.css'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  return (
    <main className="login-page relative flex min-h-screen min-h-[100svh] flex-col items-center justify-center px-4 py-8">

      {/* Zakhira Logo - Top Center */}
      <div className="relative z-30 mb-5 flex w-32 items-center justify-center sm:w-36">
        <BrandLogo />
      </div>

      {/* Language Dropdown - Top Right */}
      <div className="language-selector">

        <button
          type="button"
          className="language-trigger"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          aria-expanded={isLanguageOpen}
          aria-haspopup="true"
        >
          <Languages
            size={16}
            className="language-icon"
          />

          <span>English</span>

          <ChevronDown
            size={14}
            className={`language-chevron ${
              isLanguageOpen ? 'language-chevron-open' : ''
            }`}
          />
        </button>

        {isLanguageOpen && (
          <div className="language-menu">

            <button
              type="button"
              onClick={() => setIsLanguageOpen(false)}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setIsLanguageOpen(false)}
            >
              اردو
            </button>

            <button
              type="button"
              onClick={() => setIsLanguageOpen(false)}
            >
              العربية
            </button>

            <button
              type="button"
              onClick={() => setIsLanguageOpen(false)}
            >
              हिन्दी
            </button>

          </div>
        )}

      </div>

      {/* Glassy Portrait Login Card */}
      <section className="login-card relative z-10 mx-auto w-full max-w-[340px] rounded-2xl border border-[rgba(247,243,234,0.85)] bg-[rgba(18,60,50,0.55)] px-5 py-5 shadow-xl backdrop-blur-[14px]">

        {/* Login Heading & Description */}
        <div className="mb-4 flex flex-col items-start text-left">

          <h1 className="block w-full text-2xl font-bold tracking-tight text-[#FDF3E8]">
            Login
          </h1>

          <p className="mt-2 block w-full text-sm leading-5 text-[#252A28]">
            Access your account and manage your inventory.
          </p>

        </div>

        {/* Login Form */}
        <LoginForm onLogin={onLogin} />

        {/* Security Footer */}
        <div className="mt-3 flex items-center justify-center gap-2 border-t border-[rgba(247,243,234,0.25)] pt-2">

          <ShieldCheck
            size={14}
            color="#F6F6F6"
            stroke="#F6F6F6"
            className="shrink-0"
          />

          <p className="security-text text-[11px] font-semibold text-[#F6F6F6]">
            Secure Business Management
          </p>

        </div>

      </section>

    </main>
  )
}
