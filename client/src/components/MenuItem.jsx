import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, restaurantId, restaurantName }) => {
  const { addItem, removeItem, getItemQty } = useCart();
  const qty = getItemQty(item.id);

  return (
    <div className="flex items-start gap-4 py-5 border-b border-gray-100 last:border-0 group">
      {/* Veg / Non-veg indicator */}
      <div className="flex-1 min-w-0">
        <div className={`inline-flex items-center mb-1.5 border-2 rounded-sm p-0.5 ${
          item.is_veg ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">{item.name}</h4>
        <p className="text-sm font-bold text-gray-900 mb-1.5">₹{item.price}</p>
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Image + Add Button */}
      <div className="flex-shrink-0 relative">
        <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-orange-50 to-orange-100">
              🍽️
            </div>
          )}
        </div>

        {/* Add / Qty Control */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {qty === 0 ? (
            <button
              onClick={() => addItem(item, restaurantId, restaurantName)}
              className="flex items-center gap-1.5 bg-white border-2 border-primary text-primary 
                         text-xs font-bold px-4 py-1.5 rounded-lg shadow-md hover:bg-primary 
                         hover:text-white transition-all duration-200 active:scale-95"
              id={`add-item-${item.id}`}
            >
              <Plus size={13} /> ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-primary text-white rounded-lg shadow-md px-2 py-1">
              <button
                onClick={() => removeItem(item.id)}
                className="hover:scale-125 transition-transform"
              >
                <Minus size={13} />
              </button>
              <span className="text-sm font-bold w-4 text-center">{qty}</span>
              <button
                onClick={() => addItem(item, restaurantId, restaurantName)}
                className="hover:scale-125 transition-transform"
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
