import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'
import { GitCompare, X, ShoppingBag, Star, ArrowRight } from 'lucide-react'

export default function ComparePage() {
  const { compareList, removeCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()

  const fmt = (v) => (v != null ? Number(v).toLocaleString('vi-VN') + 'đ' : '—')

  // Các dòng thuộc tính so sánh
  const rows = [
    { label: 'Giá bán', render: (i) => <span className="text-lg font-bold text-cyan-400">{fmt(i.price)}</span> },
    { label: 'Danh mục', render: (i) => i.categoryName || '—' },
    { label: 'Đánh giá', render: (i) => (
        <span className="inline-flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          {i.averageRating ? i.averageRating.toFixed(1) : 'Mới'} ({i.totalReviews || 0})
        </span>
      ) },
    { label: 'Mô tả', render: (i) => <span className="text-sm text-slate-400">{i.description || '—'}</span> },
    { label: 'Tình trạng', render: (i) => (
        <span className={`text-sm font-semibold ${i.available ? 'text-green-400' : 'text-red-500'}`}>
          {i.available ? 'Còn hàng' : 'Hết hàng'}
        </span>
      ) },
  ]

  // Tìm giá thấp nhất để làm nổi bật
  const minPrice = compareList.length ? Math.min(...compareList.map(i => i.price || Infinity)) : 0

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-sm">DuongTech</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-1 flex items-center gap-3">
              <GitCompare className="text-cyan-400" size={32} />
              So sánh cấu hình
            </h1>
            <p className="text-slate-400 mt-2">Đặt các sản phẩm cạnh nhau để chọn lựa dễ dàng hơn</p>
          </div>
          {compareList.length > 0 && (
            <button onClick={clearCompare} className="text-sm text-slate-400 hover:text-red-500 font-medium">
              Xóa tất cả
            </button>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-white/10">
            <div className="bg-white/5 border border-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GitCompare size={40} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có sản phẩm để so sánh</h3>
            <p className="text-slate-400 mb-6">Vào trang sản phẩm và bấm "So sánh" trên các laptop bạn quan tâm.</p>
            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all">
              Xem sản phẩm <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 uppercase tracking-wider w-40 align-bottom">Thông số</th>
                  {compareList.map(item => (
                    <th key={item.id} className="p-4 align-top border-l border-white/10 min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => removeCompare(item.id)}
                          className="absolute -top-1 -right-1 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80'}
                          alt={item.name}
                          className="w-full h-28 object-cover rounded-xl mb-3 border border-white/10"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80' }}
                        />
                        <p className="font-bold text-white text-left leading-snug">{item.name}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.label} className={idx % 2 ? 'bg-white/[0.03]' : ''}>
                    <td className="p-4 text-sm font-semibold text-slate-400 align-top">{row.label}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-4 border-l border-white/10 align-top text-slate-200">
                        {row.label === 'Giá bán' && item.price === minPrice && compareList.length > 1 ? (
                          <span className="inline-flex flex-col gap-1">
                            {row.render(item)}
                            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full w-fit">RẺ NHẤT</span>
                          </span>
                        ) : (
                          row.render(item)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  {compareList.map(item => (
                    <td key={item.id} className="p-4 border-l border-white/10">
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                      >
                        <ShoppingBag size={16} /> Thêm
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
