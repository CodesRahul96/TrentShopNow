import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

// StarRating Component (simple implementation, adjust as needed)
const StarRating = ({ rating, readOnly, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-${readOnly ? 'default' : 'pointer'} ${star <= rating ? 'text-yellow-accent' : 'text-light-text/50'}`}
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = res.data;
        setProduct(productData);

        // Calculate average rating
        const avg = productData.reviews?.length > 0
          ? productData.reviews.reduce((sum, r) => sum + r.rating, 0) / productData.reviews.length
          : 0;
        setAverageRating(avg.toFixed(1));
        setReviews(productData.reviews || []);

        // Fetch related products
        const relatedRes = await axios.get(`http://localhost:5000/api/products?category=${productData.category}`);
        setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart({ ...product, quantity });
      navigate('/cart'); // Optional: redirect to cart page
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to submit a review');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { user: 'User', comment: newReview.comment, rating: newReview.rating }, // Replace 'User' with actual user data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(res.data.reviews);
      setAverageRating(
        res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length
      );
      setNewReview({ comment: '', rating: 5 });
    } catch (err) {
      setError('Failed to submit review');
      console.error('Error submitting review:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-light-text text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20 px-6">
      <div className="container mx-auto">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-effect rounded-lg p-6 shadow-glass hover-effect">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4 text-yellow-accent">{product.name}</h1>
            <p className="text-lg mb-4 text-light-text">{product.description}</p>
            <p className="text-3xl font-semibold mb-4 text-yellow-accent">${product.price}</p>
            <p className="mb-4 text-light-text">Stock: {product.stock}</p>
            <div className="mb-4 flex items-center">
              <span className="mr-2 text-light-text">Average Rating:</span>
              <StarRating rating={parseFloat(averageRating) || 0} readOnly />
              <span className="ml-2 text-light-text">({averageRating} / 5)</span>
            </div>
            <div className="mb-6 flex items-center">
              <label className="mr-3 text-lg text-light-text">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
                className="w-20 p-2 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-yellow-accent text-dark-bg px-8 py-3 rounded-lg hover:bg-light-yellow transition-colors shadow-md hover-effect font-semibold"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <p className="mt-4 text-light-text">
              Category:{' '}
              <Link to={`/category/${product.category}`} className="text-yellow-accent hover:text-light-yellow transition-colors">
                {product.category}
              </Link>
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 glass-effect p-6 rounded-lg shadow-glass hover-effect">
          <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev, index) => (
                <div key={index} className="border-b border-light-yellow/20 pb-4">
                  <div className="flex items-center">
                    <p className="text-light-text font-semibold mr-2">{rev.user}</p>
                    <StarRating rating={rev.rating} readOnly />
                  </div>
                  <p className="text-light-text/80">{rev.comment}</p>
                  <p className="text-light-text/60 text-sm">{new Date(rev.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-light-text/70">No reviews yet. Be the first to review!</p>
          )}

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
            <textarea
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              rows="4"
              required
            />
            <div className="flex items-center gap-4">
              <label className="text-light-text">Your Rating:</label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-accent text-dark-bg py-3 rounded hover:bg-light-yellow transition-colors hover-effect font-semibold"
              disabled={!token}
            >
              {token ? 'Submit Review' : 'Login to Review'}
            </button>
          </form>
        </div>

        {/* Related Products */}
        <div className="mt-12 glass-effect p-6 rounded-lg shadow-glass hover-effect">
          <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Related Products</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link to={`/product/${related._id}`} key={related._id} className="glass-effect rounded-lg p-4 shadow-glass hover-effect">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-light-text">{related.name}</h3>
                    <p className="text-yellow-accent font-bold">${related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-light-text/70">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}