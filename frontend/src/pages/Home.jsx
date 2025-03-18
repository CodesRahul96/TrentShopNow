import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductSlider from '../components/ProductSlider';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-6 text-text">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-primary">Featured Products</h1>
      {categories.map(category => (
        <div key={category}>
          <ProductSlider products={products} category={category} />
          <Link
            to={`/category/${category}`}
            className="text-primary hover:text-accent transition-colors mb-6 block text-center font-semibold"
          >
            View All {category} Products
          </Link>
        </div>
      ))}
    </div>
  );
}