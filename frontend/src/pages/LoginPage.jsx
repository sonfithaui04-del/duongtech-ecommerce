import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Cpu, ArrowRight, Mail, Lock, Loader } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData)
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 pt-28 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-20 translate-x-1/2 translate-y-1/2"></div>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-white/10 p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-500/40 transform rotate-3">
            <Cpu size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h2>
          <p className="text-slate-400">Đăng nhập để khám phá thế giới công nghệ</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-cyan-400 font-semibold hover:text-cyan-300">Quên mật khẩu?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} /> Đang xử lý...
              </>
            ) : (
              <>
                Đăng nhập <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = 'http://localhost:9081/oauth2/authorization/google'}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-3.5 rounded-xl font-bold text-slate-200 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Đăng nhập bằng Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
