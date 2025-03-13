import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductSlider({ products, category }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const filteredProducts = products.filter(product => product.category === category);
  const totalSlides = Math.ceil(filteredProducts.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const startIndex = currentIndex * itemsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 capitalize text-primary">{category}</h2>
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {filteredProducts.map(product => (
            <div key={product._id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 px-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {filteredProducts.length > itemsPerPage && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-accent transition-colors z-10"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-accent transition-colors z-10"
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}