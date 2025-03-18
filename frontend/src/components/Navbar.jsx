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
  const [profilePicture, setProfilePicture] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzBE_P3rPclK8gJnC-y1Mq7kNOvyL8yUHlg&s');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUserRole(decoded.role);
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            if (res.data.profilePicture) {
              setProfilePicture(`${import.meta.env.VITE_BASE_URL}${res.data.profilePicture}`);
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

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Close dropdown when toggling mobile menu
    setIsCartOpen(false); // Close cart when toggling mobile menu
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-dark-bg text-light-text shadow-lg z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-accent">
          TrentShopNow
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="md:hidden text-light-text focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-light-text hover:text-yellow-accent transition-colors">
            Home
          </Link>
          <Link to="/top-products" className="text-light-text hover:text-yellow-accent transition-colors">
            Top Picks
          </Link>
          <Link to="/contact" className="text-light-text hover:text-yellow-accent transition-colors">
            Contact
          </Link>

          {/* Cart Icon */}
          <div className="relative">
            <button onClick={toggleCart} className="text-light-text hover:text-yellow-accent transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-accent text-dark-bg text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-72 glass-effect p-4 rounded-lg shadow-glass bg-glass-bg/70 backdrop-blur-md">
                {cart.length > 0 ? (
                  <>
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          <div className="ml-2">
                            <p className="text-light-text text-sm truncate">{item.name}</p>
                            <p className="text-yellow-accent text-sm">${item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="text-light-text hover:text-yellow-accent px-1"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-light-text mx-1">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="text-light-text hover:text-yellow-accent px-1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-400 hover:text-red-500 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/cart"
                      className="block text-center bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors mt-2"
                      onClick={() => setIsCartOpen(false)}
                    >
                      View Cart
                    </Link>
                  </>
                ) : (
                  <p className="text-light-text/70 text-center">Cart is empty</p>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-light-text hover:text-yellow-accent transition-colors"
            >
              <img src={profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-effect p-2 rounded-lg shadow-glass bg-glass-bg/70 backdrop-blur-md">
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === 'user' && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    User Dashboard
                  </Link>
                )}
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:hidden absolute top-16 left-0 w-full bg-dark-bg glass-effect shadow-glass p-6`}
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-light-text hover:text-yellow-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/top-products"
              className="text-light-text hover:text-yellow-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Top Picks
            </Link>
            <Link
              to="/contact"
              className="text-light-text hover:text-yellow-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Cart (Mobile) */}
            <div>
              <button
                onClick={toggleCart}
                className="text-light-text hover:text-yellow-accent transition-colors flex items-center w-full"
              >
                Cart
                {totalItems > 0 && (
                  <span className="ml-2 bg-yellow-accent text-dark-bg text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <div className="mt-2 w-full glass-effect p-4 rounded-lg shadow-glass bg-glass-bg/70 backdrop-blur-md">
                  {cart.length > 0 ? (
                    <>
                      {cart.map((item) => (
                        <div key={item._id} className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div className="ml-2">
                              <p className="text-light-text text-sm truncate">{item.name}</p>
                              <p className="text-yellow-accent text-sm">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="text-light-text hover:text-yellow-accent px-1"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-light-text mx-1">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="text-light-text hover:text-yellow-accent px-1"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-400 hover:text-red-500 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      <Link
                        to="/cart"
                        className="block text-center bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors mt-2"
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        View Cart
                      </Link>
                    </>
                  ) : (
                    <p className="text-light-text/70 text-center">Cart is empty</p>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown (Mobile) */}
            <div>
              <button
                onClick={toggleDropdown}
                className="text-light-text hover:text-yellow-accent transition-colors flex items-center w-full"
              >
                <img src={profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                Account
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="mt-2 w-full glass-effect p-2 rounded-lg shadow-glass bg-glass-bg/70 backdrop-blur-md">
                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {userRole === 'user' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      User Dashboard
                    </Link>
                  )}
                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-light-text hover:text-yellow-accent transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}