import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MenuPage from './pages/MenuPage'
import ComparePage from './pages/ComparePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import MyOrdersPage from './pages/MyOrdersPage'
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler'
import ShipperDashboard from './pages/ShipperDashboard'
import CompareBar from './components/CompareBar'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/shipper" element={<ShipperDashboard />} />
        </Routes>
      </main>
      <CompareBar />
      <Footer />
    </div>
  )
}

export default App
