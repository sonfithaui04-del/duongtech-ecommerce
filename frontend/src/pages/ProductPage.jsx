import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useCompare } from '../context/CompareContext'
import { Search, ShoppingBag, Star, GitCompare, Laptop, LayoutGrid } from 'lucide-react'
import ProductModal from '../components/ProductModal'

const PAGE_SIZE = 16

function getPageNumbers(current, total) {
  const pages = []
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); return pages }
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItemForModal, setSelectedItemForModal] = useState(null)
  const [page, setPage] = useState(1)
  const { addToCart } = useCart()
  const { isComparing, toggleCompare } = useCompare()

  // Reset về trang 1 khi đổi danh mục / tìm kiếm
  useEffect(() => { setPage(1) }, [selectedCategory, searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          axios.get('/api/products?availableOnly=true'),
          axios.get('/api/categories?activeOnly=true')
        ])
        setProducts(productRes.data || [])
        setCategories(catRes.data || [])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = products.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const displayed = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950">

      {/* Header Section */}
      <div className="relative pt-32 pb-12 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950"></div>
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-sm">Cửa hàng</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white mt-2">Sản Phẩm Nổi Bật</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Khám phá đa dạng laptop chính hãng cấu hình mạnh. Từ dòng Gaming đỉnh cao đến Ultrabook mỏng nhẹ hiện đại.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 lg:sticky lg:top-28">
              <div className="flex items-center gap-2 text-white font-bold mb-4">
                <LayoutGrid size={18} className="text-cyan-400" /> Danh mục
              </div>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm text-left transition-all duration-300 whitespace-nowrap lg:w-full ${
                    selectedCategory === 'ALL'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm text-left transition-all duration-300 whitespace-nowrap lg:w-full ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product area */}
          <div className="flex-1">
            {!loading && (
              <p className="text-sm text-slate-400 mb-4">{filteredItems.length} sản phẩm · Trang <span className="font-bold text-white">{currentPage}</span>/{totalPages}</p>
            )}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-slate-900 rounded-2xl border border-white/10">
                <div className="bg-white/5 border border-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Laptop size={40} className="text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-slate-400">Vui lòng thử tìm kiếm hoặc chọn danh mục khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayed.map((item) => (
                  <div key={item.id} className="bg-slate-900 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                    <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setSelectedItemForModal(item)}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80'}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="text-white font-bold tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">Xem chi tiết</span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(item); }}
                        title={isComparing(item.id) ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
                        className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 backdrop-blur-md rounded-xl text-sm font-semibold transition-all border ${
                          isComparing(item.id)
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent shadow-lg shadow-blue-500/30'
                            : 'bg-slate-900/70 text-slate-200 border-white/10 hover:text-cyan-400 hover:border-cyan-400/40'
                        }`}
                      >
                        <GitCompare size={16} />
                        {isComparing(item.id) ? 'Đang so sánh' : 'So sánh'}
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedItemForModal(item)}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg shrink-0">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-slate-200">{item.averageRating ? item.averageRating.toFixed(1) : 'Mới'}</span>
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                        {item.description || 'Laptop chính hãng, cấu hình mạnh, bảo hành uy tín.'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Giá</span>
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            {item.price?.toLocaleString('vi-VN')}
                            <span className="text-sm text-slate-500 font-normal align-top">đ</span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 font-medium transform active:scale-95"
                        >
                          <ShoppingBag size={18} />
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Trước
                </button>
                {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                  p === '...' ? (
                    <span key={`e${idx}`} className="px-2 text-slate-500">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        p === currentPage
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  )
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedItemForModal && (
        <ProductModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  )
}
