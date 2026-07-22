import { useNavigate, useLocation } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { X, GitCompare, ArrowRight } from 'lucide-react'

export default function CompareBar() {
  const { compareList, removeCompare, clearCompare } = useCompare()
  const navigate = useNavigate()
  const location = useLocation()

  // Ẩn thanh khi không có gì hoặc đang ở trang so sánh
  if (compareList.length === 0 || location.pathname === '/compare') return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-cyan-400 font-bold shrink-0">
            <GitCompare size={22} />
            <span>So sánh ({compareList.length})</span>
          </div>

          <div className="flex-1 flex items-center gap-3 overflow-x-auto py-1">
            {compareList.map(item => (
              <div key={item.id} className="relative shrink-0 group">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=80'}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=80' }}
                />
                <button
                  onClick={() => removeCompare(item.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="text-sm text-slate-400 hover:text-red-500 font-medium px-3 py-2 hidden sm:block"
            >
              Xóa hết
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={compareList.length < 2}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              So sánh ngay <ArrowRight size={18} />
            </button>
          </div>
        </div>
        {compareList.length < 2 && (
          <p className="text-xs text-slate-500 mt-1 text-center sm:text-left">Chọn thêm ít nhất 2 sản phẩm để so sánh</p>
        )}
      </div>
    </div>
  )
}
