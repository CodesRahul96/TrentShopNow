import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// StarRating Component (for display, optional)
const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-accent' : 'text-light-text/50'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative or zero quantities
    const product = cart.find(item => item._id === productId);
    if (newQuantity > product.stock) {
      setError(`Cannot exceed stock limit of ${product.stock} for ${product.name}`);
      return;
    }
    updateQuantity(productId, newQuantity);
    setError('');
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setError('');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('Cart is empty. Add items before checking out.');
      return;
    }
    navigate('/checkout'); // Redirect to checkout page
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-yellow-accent">Your Cart</h1>

        {error && (
          <p className="text-red-400 text-center mb-6">{error}</p>
        )}

        {cart.length === 0 ? (
          <div className="glass-effect p-6 rounded-lg shadow-glass text-center">
            <p className="text-light-text/70 mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="text-yellow-accent hover:text-light-yellow transition-colors font-semibold text-lg hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            {cart.map(item => (
              <div
                key={item._id}
                className="glass-effect rounded-lg p-6 shadow-glass hover-effect flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-light-text hover:text-yellow-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-light-text/80 text-sm">{item.description?.slice(0, 50)}...</p>
                    <div className="flex items-center gap-2">
                      <p className="text-yellow-accent font-bold">${item.price}</p>
                      {item.rating && <StarRating rating={item.rating} />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="bg-dark-accent text-light-text px-3 py-1 rounded hover:bg-yellow-accent hover:text-dark-bg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                      className="w-16 p-2 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent text-center"
                      min="1"
                      max={item.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="bg-yellow-accent text-dark-bg px-3 py-1 rounded hover:bg-light-yellow transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-400 hover:text-red-600 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Total and Checkout */}
            <div className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <div className="flex justify-between items-center mb-4">
                <p className="text-light-text text-lg">Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="text-yellow-accent text-2xl font-semibold">Total: ${calculateTotal()}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-accent text-dark-bg py-3 rounded hover:bg-light-yellow transition-colors hover-effect font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}