
import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
}

export default function PasswordInput({
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label
        htmlFor="password"
        className="text-sm font-semibold text-[#252A28]"
      >
        Password
      </label>

      <div className="flex h-12 items-center rounded-lg border border-[#D9D5CA] bg-white px-3 transition focus-within:border-[#123C32] focus-within:ring-2 focus-within:ring-[#123C32]/10">
        <LockKeyhole size={18} className="text-[#66745A]" />

        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#252A28] outline-none placeholder:text-gray-400"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[#66745A] hover:text-[#123C32]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  )
}
