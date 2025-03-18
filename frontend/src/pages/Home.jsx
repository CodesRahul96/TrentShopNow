import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// StarRating Component (reused)
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

// Top Picks Slider Component with Arrows
const TopPicksSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItems = 4; // Number of items visible at once
  const maxIndex = Math.max(0, products.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {products.map(product => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="glass-effect rounded-lg p-4 shadow-glass hover-effect flex-shrink-0 w-1/4"
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
      </div>
      {/* Arrow Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-yellow-accent text-dark-bg p-3 rounded-full hover:bg-light-yellow transition-colors hover-effect"
        disabled={currentIndex === 0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-yellow-accent text-dark-bg p-3 rounded-full hover:bg-light-yellow transition-colors hover-effect"
        disabled={currentIndex >= maxIndex}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const allProducts = response.data;
        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map(product => product.category))];
        setCategories(uniqueCategories);

        // Sort and take top products
        const top = allProducts
          .sort((a, b) => (b.rating || b.price) - (a.rating || a.price))
          .slice(0, 8); // Limit to 8 for the slider
        setTopProducts(top);
      } catch (error) {
        setError('Failed to load products');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

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
        {/* Top Picks Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-yellow-accent">
            Top Picks
          </h1>
          <div className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            {topProducts.length > 0 ? (
              <TopPicksSlider products={topProducts} />
            ) : (
              <p className="text-light-text/70 text-center">No top products available.</p>
            )}
            <Link
              to="/top-products"
              className="text-yellow-accent hover:text-light-yellow transition-colors mt-6 block text-center font-semibold text-lg hover:underline"
            >
              View All Top Picks
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center text-yellow-accent">
            Shop by Category
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <Link
                  to={`/category/${category}`}
                  key={category}
                  className="glass-effect rounded-lg p-6 shadow-glass hover-effect flex items-center justify-center"
                >
                  <h3 className="text-xl font-semibold text-light-text text-center">
                    {category}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-light-text/70 text-center">No categories available.</p>
          )}
        </section>
      </div>
    </div>
  );
}