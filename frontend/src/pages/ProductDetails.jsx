import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';

export default function ProductDetails() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);

        const allProducts = await axios.get('http://localhost:5000/api/products');
        const related = allProducts.data
          .filter(p => p.category === response.data.category && p._id !== productId)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    addToCart(productWithQuantity);
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to submit a review.');
      return;
    }
    if (rating === 0 || !comment.trim()) {
      alert('Please provide a rating and comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(prev => ({
        ...prev,
        reviews: [...prev.reviews, response.data]
      }));
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!product) return <div className="container mx-auto p-6 text-text">Loading...</div>;

  const averageRating = product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : 'No reviews yet';

  return (
    <div className="container mx-auto p-6 text-text">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-background rounded-lg p-6 shadow-lg">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4 text-primary">{product.name}</h1>
          <p className="text-lg mb-4">{product.description}</p>
          <p className="text-3xl font-semibold mb-4 text-text">${product.price}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <div className="mb-4 flex items-center">
            <span className="mr-2">Average Rating:</span>
            <StarRating rating={parseFloat(averageRating) || 0} readOnly />
            <span className="ml-2">({averageRating} / 5)</span>
          </div>
          <div className="mb-6 flex items-center">
            <label className="mr-3 text-lg">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
              className="w-20 p-2 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors shadow-md"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <p className="mt-4">
            Category: <Link to={`/category/${product.category}`} className="text-primary hover:text-accent transition-colors">{product.category}</Link>
          </p>
        </div>
      </div>

      <div className="mt-12 bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-primary">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <p className="font-semibold">{review.user?.email || 'Anonymous'}</p>
                <div className="flex items-center">
                  <StarRating rating={review.rating} readOnly />
                  <span className="ml-2">({review.rating} / 5)</span>
                </div>
                <p className="mt-2">{review.comment || 'No comment provided'}</p>
                <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
        {isLoggedIn && (
          <form onSubmit={handleSubmitReview} className="mt-8 space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Write a Review</h3>
            <div>
              <label className="block mb-1">Rating:</label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            <div>
              <label className="block mb-1">Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your review..."
                className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                rows="4"
                required
              />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-accent transition-colors shadow-md">
              Submit Review
            </button>
          </form>
        )}
        {!isLoggedIn && (
          <p className="mt-4">
            <Link to="/login" className="text-primary hover:text-accent transition-colors">Log in</Link> to leave a review.
          </p>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-primary">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(related => (
              <ProductCard key={related._id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}