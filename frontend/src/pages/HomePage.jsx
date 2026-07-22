import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { ArrowRight, Star, ShoppingBag, Cpu, Zap, Monitor, HardDrive, Gauge, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/menu?availableOnly=true')
        // Get top 4 items
        setFeaturedItems(res.data.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    { id: 1, name: 'Laptop Gaming', icon: Zap, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', count: '12 Sản phẩm' },
    { id: 2, name: 'Văn phòng', icon: Monitor, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80', count: '18 Sản phẩm' },
    { id: 3, name: 'Đồ hoạ', icon: Cpu, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', count: '9 Sản phẩm' },
    { id: 4, name: 'Phụ kiện', icon: HardDrive, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', count: '25 Sản phẩm' },
  ]

  const specs = [
    { icon: Cpu, title: 'Chip thế hệ mới', desc: 'Intel Core Ultra / AMD Ryzen AI' },
    { icon: Gauge, title: 'Tần số cao', desc: 'Màn hình 144Hz - 240Hz' },
    { icon: HardDrive, title: 'SSD NVMe', desc: 'Tốc độ đọc tới 7000MB/s' },
    { icon: ShieldCheck, title: 'Bảo hành 24T', desc: 'Chính hãng toàn quốc' },
  ]

  const brands = ['ASUS ROG', 'MSI', 'Lenovo Legion', 'Acer Predator', 'Dell XPS', 'HP Omen']

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />

      {/* Tech spec strip */}
      <section className="container mx-auto px-4 -mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {specs.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="group bg-slate-900 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-cyan-400 flex items-center justify-center border border-white/10 shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{s.title}</p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-sm">Danh mục</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Khám phá sản phẩm</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.id}
                to="/menu"
                className="group relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/5] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-600/40 to-transparent transition-opacity duration-300"></div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-lg bg-slate-900/70 backdrop-blur border border-white/10 text-cyan-400 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                    {cat.count} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-slate-900 border-y border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-sm">Phổ biến</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Sản phẩm bán chạy</h2>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-slate-950 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur border border-white/10 rounded-lg text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <ShieldCheck size={12} /> Bảo hành 24T
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold shrink-0">
                        <Star size={14} fill="currentColor" /> {item.averageRating ? item.averageRating.toFixed(1) : 'Mới'}
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {(item.price || 0).toLocaleString('vi-VN')}đ
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-3 bg-white/5 border border-white/10 text-cyan-400 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:text-white hover:border-transparent transition-all duration-300"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30">
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand marquee strip */}
      <section className="py-12 container mx-auto px-4">
        <p className="text-center text-slate-500 text-sm uppercase tracking-[0.2em] font-semibold mb-6">Thương hiệu chính hãng</p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {brands.map((b, i) => (
            <span key={i} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-sm hover:border-cyan-400/40 hover:text-cyan-400 transition-colors">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-900 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Tại sao chọn chúng tôi?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Không chỉ bán laptop, chúng tôi mang đến trải nghiệm mua sắm an tâm. Đây là lý do hàng ngàn khách hàng tin tưởng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Bảo hành chính hãng', desc: 'Sản phẩm chính hãng 100%, bảo hành lên đến 24 tháng.', icon: '🛡️' },
              { title: 'Trả góp 0%', desc: 'Hỗ trợ trả góp lãi suất 0% qua thẻ và các đối tác tài chính.', icon: '💳' },
              { title: 'Giao hàng toàn quốc', desc: 'Giao hàng nhanh chóng toàn quốc kèm hỗ trợ kỹ thuật tận tâm.', icon: '🚚' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
