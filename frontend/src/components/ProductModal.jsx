import React, { useState, useEffect } from 'react';
import api from '../services/apiClient';
import { X, Star, MessageSquare, Calculator } from 'lucide-react';

export default function ProductModal({ item, onClose, addToCart }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Trả góp state
  const [months, setMonths] = useState(12);
  const [downPercent, setDownPercent] = useState(0);

  useEffect(() => {
    if (item) {
      fetchReviews();
    }
  }, [item]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await api.get(`/api/products/reviews/item/${item.id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    const user = JSON.parse(userStr);

    try {
      setSubmitting(true);
      await api.post('/api/products/reviews',
        {
          productId: item.id,
          rating,
          comment
        },
        {
          headers: {
            'X-User-Id': user.userId || user.id
          }
        }
      );
      // Reset form & refresh reviews
      setRating(5);
      setComment('');
      fetchReviews();
      alert("Cảm ơn bạn đã đánh giá!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-xl transition-colors"
        >
          <X size={24} className="text-slate-300" />
        </button>

        {/* Left Side: Image & Basic Info */}
        <div className="w-full md:w-1/2 bg-slate-950 flex flex-col relative h-64 md:h-auto">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                {item.averageRating ? item.averageRating.toFixed(1) : 'Chưa có'}
              </span>
              <span className="flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <MessageSquare size={16} />
                {item.totalReviews || 0} đánh giá
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Reviews */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-900 h-[50vh] md:h-auto overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-8 flex-1">
            <div className="flex items-end justify-between mb-4">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {item.price?.toLocaleString('vi-VN')} <span className="text-lg text-slate-500 font-normal">đ</span>
              </span>
              <button
                onClick={() => { addToCart(item); onClose(); }}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all active:scale-95"
              >
                Thêm vào giỏ
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 border-b border-white/10 pb-6">{item.description}</p>

            {/* Installment Calculator */}
            {(() => {
              const price = parseFloat(item.price) || 0;
              const downAmount = Math.round(price * downPercent / 100);
              const financed = price - downAmount;
              const monthly = months > 0 ? Math.round(financed / months) : 0;
              const fmt = (v) => v.toLocaleString('vi-VN') + 'đ';
              return (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <Calculator size={18} className="text-cyan-400" /> Tính trả góp 0% lãi suất
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Ước tính số tiền trả hằng tháng qua thẻ tín dụng</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Kỳ hạn</label>
                      <select
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-950 text-white cursor-pointer"
                      >
                        {[6, 9, 12, 18, 24].map(m => <option key={m} value={m}>{m} tháng</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Trả trước</label>
                      <select
                        value={downPercent}
                        onChange={(e) => setDownPercent(Number(e.target.value))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-950 text-white cursor-pointer"
                      >
                        {[0, 20, 30, 50].map(d => <option key={d} value={d}>{d}%</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-white/10 rounded-xl p-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Góp mỗi tháng</p>
                      <p className="text-2xl font-bold text-cyan-400">{fmt(monthly)}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 leading-relaxed">
                      <p>Trả trước: <span className="font-semibold text-slate-300">{fmt(downAmount)}</span></p>
                      <p>Kỳ hạn: <span className="font-semibold text-slate-300">{months} tháng</span></p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Reviews Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Đánh giá từ khách hàng
              </h3>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-slate-300">Chấm điểm:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none h-24 mb-3 text-sm"
                  required
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </div>
              </form>

              {/* Review List */}
              <div className="space-y-4">
                {loadingReviews ? (
                  <p className="text-center text-slate-500 py-4">Đang tải đánh giá...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-center text-slate-500 py-4 bg-white/5 border border-white/10 rounded-xl">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          U
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">User #{r.userId}</p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={star <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-slate-500">
                          {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm pl-10 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
