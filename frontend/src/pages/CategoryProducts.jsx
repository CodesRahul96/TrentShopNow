import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function CategoryProducts() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/products`)
      .then(response => {
        const filteredProducts = response.data.filter(product => product.category === category);
        setProducts(filteredProducts);
      })
      .catch(error => console.error(error));
  }, [category]);

  return (
    <div className="container mx-auto p-6 text-primary">
      <h1 className="text-4xl font-bold mb-8 capitalize text-center">{category} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 && <p className="text-center text-lg">No products found in this category.</p>}
    </div>
  );
}