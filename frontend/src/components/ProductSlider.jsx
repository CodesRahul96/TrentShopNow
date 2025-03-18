import { Link } from 'react-router-dom';

// Simple StarRating component for product cards
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

export default function ProductSlider({ products, category }) {
  const filteredProducts = category === 'Top Picks'
    ? products
    : products.filter(product => product.category === category);

  return (
    <div className="overflow-x-auto pb-4">
      <h2 className="text-2xl font-semibold text-yellow-accent mb-4">{category}</h2>
      {filteredProducts.length > 0 ? (
        <div className="flex space-x-6">
          {filteredProducts.map(product => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="glass-effect rounded-lg p-4 shadow-glass hover-effect flex-shrink-0 w-72"
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
                  onClick={(e) => e.preventDefault()} // Prevent Link navigation for demo; replace with addToCart logic
                >
                  Quick Add
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-light-text/70">No products in this category.</p>
      )}
    </div>
  );
}