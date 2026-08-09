import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { subscribeOrderChat } from '../services/socketService'

import { Package, Clock, MapPin, Phone, ChevronRight, ShoppingBag, CheckCircle, Truck, XCircle, AlertCircle, QrCode, X, Copy, Check, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import ChatBox from '../components/ChatBox'
import { OrderSkeleton } from '../components/Skeleton'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, getToken } = useAuth()
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrPaymentInfo, setQrPaymentInfo] = useState(null)
  const [copied, setCopied] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paidOrderId, setPaidOrderId] = useState(null)
  const [cancelOrderId, setCancelOrderId] = useState(null)
  const [activeChatOrderId, setActiveChatOrderId] = useState(null)
  // orderId -> số tin nhắn chưa đọc từ phía shop
  const [unreadChat, setUnreadChat] = useState({})
  // Dùng ref để callback của WebSocket luôn đọc được đơn đang mở mới nhất
  const activeChatRef = useRef(null)

  useEffect(() => {
    activeChatRef.current = activeChatOrderId
  }, [activeChatOrderId])

  // Các trạng thái đơn còn được phép nhắn tin (khớp với điều kiện hiện nút chat)
  const CHATTABLE_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING']

  const openChat = (orderId) => {
    setActiveChatOrderId(orderId)
    setUnreadChat(prev => ({ ...prev, [orderId]: 0 }))
  }

  // Nghe tin nhắn của TẤT CẢ đơn đang hoạt động, không đợi khách mở khung chat.
  // Nhờ vậy shop trả lời lúc khung chat đang đóng thì vẫn có chấm đỏ báo.
  useEffect(() => {
    if (!user || orders.length === 0) return

    const myId = String(user.userId || user.id)

    const unsubscribers = orders
      .filter(o => CHATTABLE_STATUSES.includes(o.status))
      .map(o => subscribeOrderChat(o.id, (event) => {
        // Tin của chính mình thì bỏ qua
        if (String(event.senderId) === myId) return
        // Đang mở đúng đơn đó thì coi như đã đọc
        if (String(activeChatRef.current) === String(o.id)) return

        setUnreadChat(prev => ({ ...prev, [o.id]: (prev[o.id] || 0) + 1 }))
        toast(`💬 Shop vừa trả lời đơn #${o.id}`, { duration: 4000 })
      }))

    return () => unsubscribers.forEach(fn => fn())
  }, [orders, user])

  useEffect(() => {
    if (user) {
      loadOrders()
    }

    const handleNotification = (event) => {
      const notification = event.detail

      // Xử lý thông báo thanh toán thành công
      if (notification?.type === 'PAYMENT_SUCCESS') {
        if (showQRModal && qrPaymentInfo?.orderId === notification.orderId) {
          setShowQRModal(false)
          setQrPaymentInfo(null)
          setPaidOrderId(notification.orderId)
          setPaymentSuccess(true)
        } else {
          setPaidOrderId(notification.orderId)
          setPaymentSuccess(true)
        }
      }

      // Reload danh sách đơn hàng cho mọi thông báo (bao gồm ORDER_STATUS_CHANGED)
      if (notification?.type === 'ORDER_STATUS_CHANGED') {
        const labels = {
          PENDING: 'Chờ xác nhận',
          CONFIRMED: 'Đã xác nhận',
          PREPARING: 'Đang chuẩn bị',
          DELIVERING: 'Đang giao hàng',
          COMPLETED: 'Hoàn thành',
          DELIVERED: 'Đã giao',
          CANCELLED: 'Đã hủy'
        }
        const statusLabel = labels[notification.status] || notification.status
        toast.success(`Đơn hàng #${notification.orderId}: ${statusLabel}`, {
          icon: '🔔',
          duration: 4000
        })
      }

      loadOrders()
    }

    window.addEventListener('notification_received', handleNotification)
    return () => window.removeEventListener('notification_received', handleNotification)
  }, [user, showQRModal, qrPaymentInfo])

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders(user.userId || user.id)
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReceipt = async (orderId) => {
    if (window.confirm('Bạn xác nhận đã nhận được hàng và muốn hoàn tất đơn hàng?')) {
      try {
        await orderService.confirmReceipt(orderId)
        toast.success('Đã xác nhận nhận hàng thành công!')
        loadOrders()
      } catch (err) {
        toast.error('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', iconColor: 'text-yellow-400', icon: Clock, label: 'Chờ xác nhận' },
      CONFIRMED: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-400', icon: CheckCircle, label: 'Đã xác nhận' },
      PREPARING: { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-400', icon: Package, label: 'Đang chuẩn bị' },
      DELIVERING: { color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', iconColor: 'text-cyan-400', icon: Truck, label: 'Đang giao hàng' },
      COMPLETED: { color: 'text-green-400 bg-green-500/10 border-green-500/20', iconColor: 'text-green-400', icon: Package, label: 'Hoàn thành' },
      DELIVERED: { color: 'text-green-400 bg-green-500/10 border-green-500/20', iconColor: 'text-green-400', icon: Package, label: 'Đã giao' },
      CANCELLED: { color: 'text-red-400 bg-red-500/10 border-red-500/20', iconColor: 'text-red-400', icon: XCircle, label: 'Đã hủy' }
    }
    if (status === 'COMPLETED') return { color: 'text-green-400 bg-green-500/10 border-green-500/20', iconColor: 'text-green-400', icon: CheckCircle, label: 'Hoàn thành' };

    return configs[status] || { color: 'text-slate-400 bg-white/5 border-white/10', iconColor: 'text-slate-400', icon: AlertCircle, label: status }
  }

  const handlePayNow = async (order) => {
    try {
      const token = getToken()
      const response = await axios.post('/api/payments/sepay/init', {
        orderId: order.id,
        userId: user?.userId || user?.id,
        amount: order.totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQrPaymentInfo(response.data)
      setShowQRModal(true)
    } catch (err) {
      toast.error('Không thể tạo mã thanh toán: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(qrPaymentInfo?.accountNumber || '')
    setCopied(true)
    toast.success('Đã copy số tài khoản!')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Handle Cancel Click (Show Modal)
  const handleCancelClick = (orderId) => {
    setCancelOrderId(orderId)
  }

  // Confirm Cancel (Call API)
  const confirmCancelOrder = async () => {
    if (!cancelOrderId) return
    try {
      await orderService.cancelOrder(cancelOrderId)
      toast.success('Đã hủy đơn hàng thành công')
      loadOrders()
    } catch (err) {
      toast.error('Không thể hủy đơn: ' + (err.response?.data?.message || err.message))
    } finally {
      setCancelOrderId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Đơn hàng của tôi</h1>
          <p className="text-slate-400 mb-8">Theo dõi và quản lý các đơn hàng gần đây</p>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-slate-900 rounded-2xl border border-red-500/20">
              <div className="text-red-500 mb-4 flex justify-center"><AlertCircle size={48} /></div>
              <p className="text-white font-medium">{error}</p>
              <button onClick={loadOrders} className="mt-4 text-cyan-400 font-bold hover:underline">Thử lại</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 rounded-2xl border border-white/10">
              <div className="bg-white/5 border border-white/10 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-slate-400 mb-8">Có vẻ như bạn chưa đặt sản phẩm nào.</p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all"
              >
                Mua ngay <ChevronRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div key={order.id} className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-400/40 transition-all duration-300 group">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <StatusIcon size={24} className={statusConfig.iconColor} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white">Đơn hàng #{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={14} /> {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Tổng tiền</p>
                        <p className="text-xl font-bold text-cyan-400">{order.totalAmount?.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-dashed border-white/10 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                                <img
                                  src={item.imageUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=80'}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=80';
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-medium text-slate-200">{item.productName}</span>
                                <p className="text-sm text-slate-500">x{item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-white">
                              {(item.price * item.quantity)?.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 pt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex-1 flex items-start gap-3">
                          <MapPin className="text-slate-500 mt-1" size={20} />
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ giao hàng</p>
                            <p className="text-slate-200 font-medium text-sm">{order.deliveryAddress}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3">
                          <Phone className="text-slate-500 mt-1" size={20} />
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại</p>
                            <p className="text-slate-200 font-medium text-sm">{order.phoneNumber}</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="flex-1 flex items-start gap-3">
                            <span className="text-slate-500 mt-1">📝</span>
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ghi chú</p>
                              <p className="text-slate-200 font-medium text-sm">{order.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Payment Info */}
                      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/10 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Phương thức:</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                            order.paymentMethod === 'SEPAY'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                            {order.paymentMethod === 'SEPAY' ? '🏦 Chuyển khoản' : '💵 COD'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Thanh toán:</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                            order.paymentStatus === 'SUCCESS'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : order.paymentStatus === 'PENDING_VERIFICATION'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-white/5 text-slate-400 border-white/10'
                          }`}>
                            {order.paymentStatus === 'SUCCESS' ? '✓ Đã thanh toán'
                              : order.paymentStatus === 'PENDING_VERIFICATION' ? 'Đang xác nhận'
                              : 'Chưa thanh toán'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 ml-auto">
                          {/* Chat Button - Show for all active orders */}
                          {CHATTABLE_STATUSES.includes(order.status) && (
                            <button
                              onClick={() => openChat(order.id)}
                              className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                unreadChat[order.id] > 0
                                  ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/50 hover:bg-cyan-400/20'
                                  : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-cyan-400/40'
                              }`}
                            >
                              <MessageSquare size={16} className="text-cyan-400" /> Nhắn tin hỗ trợ
                              {unreadChat[order.id] > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                                  {unreadChat[order.id]}
                                </span>
                              )}
                            </button>
                          )}

                          {/* Cancel Button - PENDING or CONFIRMED */}
                          {['PENDING', 'CONFIRMED'].includes(order.status) && (
                            <button
                              onClick={() => handleCancelClick(order.id)}
                              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
                            >
                              <XCircle size={16} /> Hủy đơn
                            </button>
                          )}

                          {/* NÚT XÁC NHẬN ĐÃ NHẬN HÀNG - Chỉ hiển thị khi trạng thái là DELIVERING */}
                          {order.status === 'DELIVERING' && (
                            <button
                              onClick={() => handleConfirmReceipt(order.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 animate-bounce-subtle"
                            >
                              <CheckCircle size={16} /> Đã nhận được hàng
                            </button>
                          )}

                          {/* Pay Now button for unpaid SEPAY orders */}
                          {order.paymentMethod === 'SEPAY' && order.paymentStatus !== 'SUCCESS' && order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handlePayNow(order)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                            >
                              💳 Thanh toán ngay
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Warning for unpaid SEPAY */}
                      {order.paymentMethod === 'SEPAY' && order.paymentStatus !== 'SUCCESS' && order.status !== 'CANCELLED' && (
                        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <p className="text-xs text-yellow-300">
                            ⚠️ <strong>Chưa thanh toán:</strong> Đơn hàng chuyển khoản cần được thanh toán để được xử lý.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Global Chat Box */}
      {activeChatOrderId && (
        <ChatBox
          orderId={activeChatOrderId}
          currentUser={user}
          senderName={user.fullName || user.email}
          onClose={() => setActiveChatOrderId(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Hủy đơn hàng?</h3>
            <p className="text-slate-400 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng #{cancelOrderId}?
              <br/>Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelOrderId(null)}
                className="flex-1 py-3 text-slate-200 font-bold bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all"
              >
                Không
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-3 text-white font-bold bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-lg shadow-red-500/30"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Payment Modal */}
      {showQRModal && qrPaymentInfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <QrCode size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Quét mã để thanh toán</h3>
              <p className="text-slate-400 text-sm">Đơn hàng #{qrPaymentInfo.orderId}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-4">
              <img
                src={qrPaymentInfo.qrCodeUrl}
                alt="QR Payment"
                className="w-full max-w-[200px] mx-auto rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-400">Ngân hàng</span>
                <span className="font-bold text-white">{qrPaymentInfo.bankCode}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-400">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{qrPaymentInfo.accountNumber}</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-slate-300"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-400">Chủ tài khoản</span>
                <span className="font-bold text-white">{qrPaymentInfo.accountName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-slate-400">Số tiền</span>
                <span className="font-bold text-cyan-400 text-lg">{qrPaymentInfo.amount?.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Nội dung CK</span>
                <span className="font-bold text-cyan-400">{qrPaymentInfo.description}</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
              <p className="text-xs text-yellow-300">
                ⚠️ <strong>Quan trọng:</strong> Nhập đúng nội dung CK <strong className="text-cyan-400">{qrPaymentInfo.description}</strong>
              </p>
            </div>

            <button
              onClick={() => {
                setShowQRModal(false)
                toast.success('Đã ghi nhận! Đơn hàng sẽ được cập nhật khi thanh toán thành công.')
                loadOrders()
              }}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              ✓ Tôi đã thanh toán
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Thanh toán thành công! 🎉</h3>
            <p className="text-slate-400 mb-6">
              Đơn hàng #{paidOrderId} đã được thanh toán và đang được xử lý.
            </p>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-300">
                ✓ Đơn hàng của bạn sẽ được chuẩn bị và giao đến địa chỉ đã đăng ký.
              </p>
            </div>

            <button
              onClick={() => {
                setPaymentSuccess(false)
                setPaidOrderId(null)
                loadOrders()
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
