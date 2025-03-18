import React from 'react';

export default function Sidebar({ items, activeItem, onItemClick }) {
  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className={`w-full text-left py-2 px-4 rounded ${
            activeItem === item.id
              ? 'bg-yellow-accent text-dark-bg'
              : 'text-light-text hover:text-yellow-accent'
          } transition-colors`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}