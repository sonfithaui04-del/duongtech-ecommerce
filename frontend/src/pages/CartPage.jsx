import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 pt-32">
          <div className="bg-slate-900 p-12 rounded-2xl border border-white/10 text-center max-w-md w-full">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trống</h2>
            <p className="text-slate-400 mb-8">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all"
            >
              Bắt đầu mua sắm <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu" className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Giỏ hàng <span className="text-slate-500 text-lg font-normal">({cart.length} sản phẩm)</span></h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-6 hover:border-cyan-400/40 transition-all duration-300">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover border border-white/10"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80';
                  }}
                />

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-cyan-400 font-bold mb-3">{(item.price || 0).toLocaleString('vi-VN')}đ</p>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-slate-950 rounded-lg border border-white/10 text-slate-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:text-cyan-400 transition-colors disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:text-cyan-400 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-xl text-white min-w-[100px]">
                  {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">Tổng đơn hàng</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính</span>
                  <span className="font-medium text-slate-200">{(total || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phí giao hàng</span>
                  <span className="text-green-400 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Thuế (0%)</span>
                  <span className="font-medium text-slate-200">0đ</span>
                </div>
                <div className="border-t border-dashed border-white/10 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-white">Tổng cộng</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{(total || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Tiến hành thanh toán
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Thanh toán an toàn • Hoàn tiền 100% nếu không hài lòng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
