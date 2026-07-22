import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Cpu, Send, ShieldCheck, CreditCard, Truck, Headphones } from 'lucide-react'

export default function Footer() {
  const badges = [
    { icon: ShieldCheck, text: 'Bảo hành 24 tháng' },
    { icon: CreditCard, text: 'Trả góp 0%' },
    { icon: Truck, text: 'Giao hàng toàn quốc' },
    { icon: Headphones, text: 'Hỗ trợ kỹ thuật 24/7' },
  ]

  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Trust badges strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-slate-300">{b.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Newsletter band */}
      <div className="container mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-white text-center lg:text-left">
            <h3 className="text-2xl font-bold">Nhận tin công nghệ & khuyến mãi</h3>
            <p className="text-blue-100 mt-1">Đăng ký để không bỏ lỡ laptop mới và ưu đãi trả góp.</p>
          </div>
          <form className="flex w-full lg:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 lg:w-72 px-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-5 py-3 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shrink-0">
              <Send size={18} /> Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Main footer: brand-heavy asymmetric layout */}
      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand block - wide */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <Cpu size={24} />
              </div>
              <span className="text-2xl font-bold text-white">
                Duong<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tech</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Hệ thống bán laptop chính hãng hàng đầu — Gaming, Văn phòng, Đồ hoạ, Ultrabook.
              Cam kết chính hãng, bảo hành uy tín và hỗ trợ kỹ thuật trọn đời.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Sản phẩm</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/menu" className="hover:text-cyan-400 transition-colors">Laptop Gaming</Link></li>
              <li><Link to="/menu" className="hover:text-cyan-400 transition-colors">Laptop Văn phòng</Link></li>
              <li><Link to="/menu" className="hover:text-cyan-400 transition-colors">Laptop Đồ hoạ</Link></li>
              <li><Link to="/menu" className="hover:text-cyan-400 transition-colors">Ultrabook</Link></li>
              <li><Link to="/compare" className="hover:text-cyan-400 transition-colors">So sánh cấu hình</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Chính sách bảo hành</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Hướng dẫn trả góp</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Vận chuyển</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin className="text-cyan-400 mt-0.5 shrink-0" size={18} /><span>123 Đường Công Nghệ, Quận 1, TP.HCM</span></li>
              <li className="flex items-center gap-3"><Phone className="text-cyan-400 shrink-0" size={18} /><span>+84 123 456 789</span></li>
              <li className="flex items-center gap-3"><Mail className="text-cyan-400 shrink-0" size={18} /><span>contact@duongtech.com</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} DuongTech. Đã đăng ký bản quyền.</p>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Điều khoản</Link>
            <Link to="/" className="hover:text-cyan-400 transition-colors">Bảo mật</Link>
            <Link to="/" className="hover:text-cyan-400 transition-colors">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
