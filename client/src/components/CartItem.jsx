import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { addItem, removeItem, deleteItem, cart } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 animate-fade-in">
      {/* Veg indicator */}
      <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
        item.is_veg ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
        <p className="text-xs text-gray-500">₹{item.price} each</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-2 py-1">
        <button
          onClick={() => removeItem(item.id)}
          className="text-primary hover:scale-125 transition-transform"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-bold text-primary w-4 text-center">{item.qty}</span>
        <button
          onClick={() => addItem(item, cart.restaurantId, cart.restaurantName)}
          className="text-primary hover:scale-125 transition-transform"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-gray-900 w-16 text-right">
        ₹{(item.price * item.qty).toFixed(0)}
      </span>

      {/* Delete */}
      <button
        onClick={() => deleteItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
        aria-label="Remove item"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};

export default CartItem;
