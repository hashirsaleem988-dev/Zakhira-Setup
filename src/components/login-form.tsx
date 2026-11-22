
import { useState, type FormEvent } from 'react'
import { Mail, ArrowRight, KeyRound } from 'lucide-react'
import PasswordInput from './password-input'

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'info' | ''>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      setMessage('Please enter your email and password.')
      setMessageType('error')
      return
    }

    const correctEmail = 'admin@zakhira.com'
    const correctPassword = 'admin123'

    if (
      email.trim().toLowerCase() === correctEmail &&
      password === correctPassword
    ) {
      onLogin()
      return
    }

    setMessage('Invalid email or password. Please try again.')
    setMessageType('error')
  }

  const handleDemoFill = () => {
    setEmail('admin@zakhira.com')
    setPassword('admin123')
    setRememberMe(true)
    setMessage('')
    setMessageType('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2.5">

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-[#FDF3E8] sm:text-sm"
        >
          Email Address
        </label>

        <div className="flex h-10 items-center gap-2.5 rounded-lg border border-[#D9D5CA] bg-white px-3 transition-all focus-within:border-[#123C32] focus-within:ring-2 focus-within:ring-[#123C32]/10">
          <Mail
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-[#66745A]"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setMessage('')
              setMessageType('')
            }}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#252A28] outline-none placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <PasswordInput
        value={password}
        onChange={(value) => {
          setPassword(value)
          setMessage('')
          setMessageType('')
        }}
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#FDF3E8] sm:text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-3.5 cursor-pointer accent-[#123C32]"
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={() => {
            setMessage('Password recovery will be connected later.')
            setMessageType('info')
          }}
          className="forgot-password text-xs font-semibold text-[#252A28] transition-colors duration-200 hover:!text-[#FDF3E8] sm:text-sm"
        >
          Forgot password?
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="group flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#C49A5A] text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#B58B4F] hover:shadow-md active:scale-[0.99]"
      >
        Sign In

        <ArrowRight
          size={17}
          strokeWidth={2}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </button>

      {/* Status Message */}
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg p-2 text-center text-xs ${
            messageType === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-[#F7F3EA] text-[#123C32]'
          }`}
        >
          {message}
        </p>
      )}

      {/* Demo Credentials */}
      <button
        type="button"
        onClick={handleDemoFill}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#C49A5A]/50 bg-[#F7F3EA] p-2 text-left transition-all hover:border-[#C49A5A] hover:bg-[#EFE7D7]"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C49A5A]">
            <KeyRound size={16} className="text-[#123C32]" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#123C32]">
              Demo Credentials
            </p>

            <p className="mt-0.5 break-all text-[11px] text-[#66745A]">
              admin@zakhira.com · admin123
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[11px] font-semibold text-[#123C32]">
          Tap to fill
        </span>
      </button>

    </form>
  )
}
