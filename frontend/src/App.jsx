import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import OrderTracking from './pages/OrderTracking';
import ProfileLayout, { ProfileDetails } from './pages/Profile';
import MyOrders from './pages/MyOrders';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ProductForm from './pages/admin/ProductForm';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageCoupons from './pages/admin/ManageCoupons';
import ManageAdmins from './pages/admin/ManageAdmins';

import './i18n';
import './styles/global.css';

function App() {
  const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/track-order" element={<OrderTracking />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/profile" element={<ProfileLayout />}>
                        <Route index element={<ProfileDetails />} />
                        <Route path="orders" element={<MyOrders />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<ManageProducts />} />
                      <Route path="products/new" element={<ProductForm />} />
                      <Route path="products/:id/edit" element={<ProductForm />} />
                      <Route path="orders" element={<ManageOrders />} />
                      <Route path="customers" element={<ManageCustomers />} />
                      <Route path="coupons" element={<ManageCoupons />} />
                      <Route path="admins" element={<ManageAdmins />} />
                    </Route>
                  </Route>
                </Routes>

                <ToastContainer
                  position={i18n.language === 'ar' ? 'top-left' : 'top-right'}
                  autoClose={3000}
                  rtl={i18n.language === 'ar'}
                  theme="colored"
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
