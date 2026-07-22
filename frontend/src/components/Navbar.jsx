import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCompare } from '../context/CompareContext'
import { ShoppingBag, LogOut, Menu, X, Cpu, Bell } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { notificationService } from '../services/notificationService'
import { connectSocket } from '../services/socketService'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { compareList } = useCompare()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Notification State
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications(user.userId)
      setNotifications(data)
      const lastReadTime = localStorage.getItem('lastReadNotificationTime')
      const newCount = data.filter(n => !lastReadTime || new Date(n.createdAt) > new Date(lastReadTime)).length
      setUnreadCount(newCount)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  // Fetch notifications & Connect Socket
  useEffect(() => {
    const stompClientRef = { current: null };

    if (user) {
      fetchNotifications()

      // Connect to socket with userId
      stompClientRef.current = connectSocket((newNotification) => {
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)

        toast(newNotification.message, {
          id: newNotification.id || `notif-${Date.now()}`, // Prevent duplicate toasts
          icon: '🔔',
          duration: 5000
        })

        // Dispatch event for other components (like MyOrdersPage)
        window.dispatchEvent(new CustomEvent('notification_received', { detail: newNotification }))
      }, user.userId || user.id) // Ensure userId is passed
    }

    return () => {
       // Don't disconnect here in Strict Mode to avoid reconnection loops.
       // The socket service is now a singleton and handles reuse.
    }
  }, [user])

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications && notifications.length > 0) {
      setUnreadCount(0)
      localStorage.setItem('lastReadNotificationTime', new Date().toISOString())
    }
  }

  const handleLogout = () => {
    import('../services/socketService').then(module => module.disconnectSocket());
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/menu' },
    { name: compareList.length ? `So sánh (${compareList.length})` : 'So sánh', path: '/compare' },
    ...(user ? [{ name: 'Đơn hàng', path: '/my-orders' }] : []),
    ...(user?.role === 'SHIPPER' ? [{ name: 'Shipper', path: '/shipper' }] : [])
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 ${
        isScrolled ? 'py-3 shadow-lg shadow-blue-950/40' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-blue-500/40 transform group-hover:rotate-12 transition-transform duration-300">
                <Cpu size={26} />
              </div>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Duong<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-white bg-white/10 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={handleNotificationClick}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-300 hover:text-cyan-400 relative"
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in slide-in-from-top-2 z-50">
                      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Thông báo</h3>
                        <span className="text-xs text-slate-500">{notifications.length} tin mới</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                            <p>Chưa có thông báo nào</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                              <div className="flex gap-3">
                                <div className="mt-1">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white text-sm">{notif.subject}</h4>
                                  <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-2 block">
                                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/cart" className="relative group">
                  <div className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-300 group-hover:text-cyan-400">
                    <ShoppingBag size={22} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 animate-bounce">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-t border-white/10 py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium py-2 px-3 rounded-xl ${
                isActive(link.path) ? 'text-white bg-white/10' : 'text-slate-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10 my-1" />
          {user ? (
            <>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-slate-300 py-2 px-3"
              >
                <span>Giỏ hàng ({cart.length})</span>
                <ShoppingBag size={20} />
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="text-left text-red-500 font-medium py-2 px-3"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2.5 border border-white/10 rounded-xl font-medium text-slate-200 hover:bg-white/5"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
