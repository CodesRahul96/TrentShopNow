import { useEffect } from 'react';

export default function Sidebar({ items, activeItem, setActiveItem }) {
  useEffect(() => {
    console.log('Sidebar rendered with items:', items, 'activeItem:', activeItem);
  }, [items, activeItem]);

  if (!items || items.length === 0) {
    return <div className="w-64 p-6 text-light-text">No menu items available</div>;
  }

  return (
    <div className="w-64 glass-effect text-light-text p-6 shadow-glass h-screen fixed top-16 left-0 overflow-y-auto z-40">
      <h2 className="text-2xl font-bold mb-6 text-yellow-accent">Menu</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveItem(item.id)}
              className={`w-full text-left p-3 rounded transition-colors hover-effect ${
                activeItem === item.id ? 'bg-yellow-accent text-dark-bg' : 'hover:bg-light-yellow hover:text-dark-bg'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}