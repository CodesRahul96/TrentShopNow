import { useState } from 'react';

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readOnly) setRating(value);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-${readOnly ? 'default' : 'pointer'} ${
            (hoverRating || rating) >= star ? 'text-primary' : 'text-gray-600'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}