import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-background text-text p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-primary">TrentShopNow</Link>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div className={`md:flex items-center space-x-6 ${isMobileMenuOpen ? 'block absolute top-16 left-0 w-full bg-background p-4 shadow-md' : 'hidden md:block'}`}>
          <Link to="/" className="hover:text-accent transition-colors py-2 md:py-0">Home</Link>
          {token ? (
            <>
              <Link to="/admin" className="hover:text-accent transition-colors py-2 md:py-0">Admin</Link>
              <button onClick={handleLogout} className="hover:text-accent transition-colors py-2 md:py-0">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent transition-colors py-2 md:py-0">Login</Link>
              <Link to="/register" className="hover:text-accent transition-colors py-2 md:py-0">Register</Link>
            </>
          )}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="flex items-center hover:text-accent transition-colors"
            >
              Cart ({totalItems})
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-background text-text shadow-lg rounded-lg p-4 z-10 border border-gray-200 animate-fade-in">
                {cart.length === 0 ? (
                  <p>Cart is empty</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item._id} className="mb-2">
                        <p>{item.name} x {item.quantity}</p>
                        <p>${item.price * item.quantity}</p>
                      </div>
                    ))}
                    <Link
                      to="/checkout"
                      className="mt-2 bg-primary text-white px-4 py-2 rounded block text-center hover:bg-accent transition-colors"
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