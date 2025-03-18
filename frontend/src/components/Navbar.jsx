import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export default function Navbar() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/40');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUserRole(decoded.role);
        axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            if (res.data.profilePicture) {
              setProfilePicture(`http://localhost:5000${res.data.profilePicture}`);
            }
          })
          .catch(err => console.error('Failed to fetch user details:', err));
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
      setProfilePicture('https://via.placeholder.com/40');
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    setProfilePicture('https://via.placeholder.com/40');
    navigate('/login');
  };

  const handleQuantityChange = (productId, change) => {
    const product = cart.find((item) => item._id === productId);
    if (product) {
      const newQuantity = product.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect p-4 shadow-glass">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-yellow-accent hover:text-light-yellow transition-colors">
          TrentShopNow
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-light-text focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div className={`md:flex items-center space-x-6 ${isMobileMenuOpen ? 'block absolute top-16 left-0 w-full glass-effect p-4 shadow-glass' : 'hidden md:block'}`}>
          <Link to="/" className="text-light-text hover:text-yellow-accent transition-colors py-2 md:py-0">Home</Link>
          {token && userRole === 'admin' && (
            <Link to="/admin" className="text-light-text hover:text-yellow-accent transition-colors py-2 md:py-0">Admin</Link>
          )}
          {token ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
                <img
                  src={profilePicture}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-yellow-accent hover-effect"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-effect text-light-text shadow-glass rounded-lg p-2 z-10">
                  {userRole === 'user' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-yellow-accent hover:text-dark-bg rounded transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-accent hover:text-dark-bg rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-light-text hover:text-yellow-accent transition-colors py-2 md:py-0">Login</Link>
              <Link to="/register" className="text-light-text hover:text-yellow-accent transition-colors py-2 md:py-0">Register</Link>
            </>
          )}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-light-text hover:text-yellow-accent transition-colors flex items-center"
            >
              Cart ({totalItems})
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-effect text-light-text shadow-glass rounded-lg p-4 z-10">
                {cart.length === 0 ? (
                  <p className="text-center">Cart is empty</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center justify-between mb-3 border-b border-light-yellow/20 pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm">${item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="bg-dark-accent text-light-text px-2 py-1 rounded hover:bg-yellow-accent hover:text-dark-bg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="bg-yellow-accent text-dark-bg px-2 py-1 rounded hover:bg-light-yellow transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-400 hover:text-red-600 transition-colors ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <p className="text-lg font-semibold mt-2">
                      Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </p>
                    <Link
                      to="/checkout"
                      className="mt-3 bg-yellow-accent text-dark-bg px-4 py-2 rounded block text-center hover:bg-light-yellow transition-colors hover-effect"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Checkout
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
    .split('')
    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
  );
  return JSON.parse(jsonPayload);
}