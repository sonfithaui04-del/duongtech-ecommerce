import { Link } from 'react-router-dom'
import { ArrowRight, Star, Clock, ShieldCheck, Cpu } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-12 px-4">
      <div className="container mx-auto">
        {/* Dark tech panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 px-6 py-14 lg:px-16 lg:py-24">
          {/* Glow + grid */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-25"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-25"></div>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          ></div>

          <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-left-10 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-cyan-300 border border-white/10 rounded-full font-semibold text-sm">
                <Cpu size={16} />
                Hệ thống bán laptop số 1
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
                Laptop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">chính hãng</span> <br/>
                Hiệu năng đỉnh cao
              </h1>

              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Khám phá bộ sưu tập laptop Gaming, Văn phòng, Đồ hoạ và Ultrabook cấu hình mạnh mẽ.
                Sản phẩm chính hãng, bảo hành uy tín và giao hàng toàn quốc.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/40 hover:shadow-cyan-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Mua ngay <ArrowRight size={20} />
                </Link>
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-cyan-400/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Xem sản phẩm
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/5 text-cyan-300 rounded-lg border border-white/10">
                    <Clock size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">24 Tháng</p>
                    <p className="text-xs text-slate-500">Bảo hành</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/5 text-yellow-400 rounded-lg border border-white/10">
                    <Star size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">4.9/5</p>
                    <p className="text-xs text-slate-500">Đánh giá</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/5 text-blue-300 rounded-lg border border-white/10">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">100%</p>
                    <p className="text-xs text-slate-500">Chính hãng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 relative animate-in slide-in-from-right-10 duration-700 delay-200">
              <div className="relative z-10 w-full max-w-lg mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl blur-2xl opacity-40"></div>
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Laptop DuongTech"
                  className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl border border-white/10"
                />

                {/* Floating Cards */}
                <div className="absolute -bottom-8 -left-8 bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Laptop"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">Cấu hình mạnh mẽ</p>
                      <div className="flex text-yellow-400 text-xs">★★★★★</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 -right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold text-cyan-400">Trả góp 0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
