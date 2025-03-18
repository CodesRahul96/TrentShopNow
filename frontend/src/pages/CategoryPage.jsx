import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// StarRating Component (reused from previous code)
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

export default function CategoryPage() {
  const { category } = useParams(); // Get category from URL (e.g., "Electronics" or "top-products")
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isTopProducts, setIsTopProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${import.meta.env.VITE_BASE_URL}api/products`;
        if (category === 'top-products') {
          setIsTopProducts(true);
          // Fetch all products and sort client-side for "top-products"
          const response = await axios.get(url);
          const allProducts = response.data;
          const top = allProducts
            .sort((a, b) => (b.rating || b.price) - (a.rating || a.price)) // Sort by rating or price
            .slice(0, 10); // Take top 10
          setProducts(top);
        } else {
          setIsTopProducts(false);
          // Fetch products by category
          const response = await axios.get(`${url}?category=${category}`);
          setProducts(response.data);
        }
      } catch (error) {
        setError('Failed to load products');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [category]);

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-yellow-accent">
          {isTopProducts ? 'Top Products' : `${category} Products`}
        </h1>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="glass-effect rounded-lg p-4 shadow-glass hover-effect"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-light-text truncate">{product.name}</h3>
                  <p className="text-light-text/80 text-sm truncate mb-2">
                    {product.description || 'No description available'}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-yellow-accent font-bold">${product.price}</p>
                    <StarRating rating={product.rating || 0} />
                  </div>
                  <button
                    className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect text-sm font-semibold"
                    onClick={(e) => e.preventDefault()} // Placeholder; replace with addToCart
                  >
                    Quick Add
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-light-text/70 text-center">
            No products available in {isTopProducts ? 'Top Products' : category}.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-yellow-accent hover:text-light-yellow transition-colors font-semibold text-lg hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}