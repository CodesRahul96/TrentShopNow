import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-background shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
        <h3 className="text-lg font-semibold text-text mt-2">{product.name}</h3>
        <p className="text-text">${product.price}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 bg-primary text-white px-4 py-2 rounded w-full hover:bg-accent transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}